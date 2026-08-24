import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export interface GeminiHistoryTurn {
    role: 'user' | 'model';
    parts: { text: string }[];
}

@Injectable()
export class GeminiService {
    private readonly logger = new Logger(GeminiService.name);
    private client: GoogleGenerativeAI;
    private chatModel: GenerativeModel;
    private embeddingModelName = 'gemini-embedding-001';

    constructor(private config: ConfigService) {
        const apiKey = this.config.get<string>('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set in environment variables');
        }
        this.client = new GoogleGenerativeAI(apiKey);
        const modelName = this.config.get<string>('GEMINI_MODEL', 'gemini-3.6-flash');
        this.chatModel = this.client.getGenerativeModel({ model: modelName });
    }

    async generateReply(systemInstruction: string, history: GeminiHistoryTurn[], message: string): Promise<string> {
        try {
            // Keep only valid turns and cap history length
            const safeHistory = history
                .filter((t) => t.role === 'user' || t.role === 'model')
                .slice(-12)
                .map((t) => ({ role: t.role, parts: [{ text: String(t.parts?.[0]?.text ?? '') }] }))
                .filter((t) => t.parts[0].text.length > 0);

            const chat = this.chatModel.startChat({
                history: safeHistory,
                generationConfig: {
                    temperature: 0.6,
                    maxOutputTokens: 1000,
                    // thinkingLevel is Gemini 3.x; cast because SDK types predate it.
                    thinkingConfig: { thinkingLevel: 'low' },
                } as any,
                systemInstruction,
            });

            const result = await chat.sendMessage(message);
            const text = result.response.text();
            return text && text.trim().length > 0 ? text.trim() : 'Sorry, I could not come up with an answer right now. Please try again or reach us via the contact page.';
        } catch (err) {
            this.logger.error(`Gemini generateReply failed: ${err?.message ?? err}`);
            throw new InternalServerErrorException('Loki is having trouble thinking right now. Please try again shortly.');
        }
    }

    async embedText(text: string): Promise<number[]> {
        try {
            const model = this.client.getGenerativeModel({ model: this.embeddingModelName });
            const result = await model.embedContent(text.slice(0, 8000));
            return Array.from(result.embedding.values ?? []);
        } catch (err) {
            this.logger.error(`Gemini embedText failed: ${err?.message ?? err}`);
            return [];
        }
    }

    async embedBatch(texts: string[], concurrency = 5): Promise<number[][]> {
        const out: number[][] = new Array(texts.length).fill(null);
        let cursor = 0;

        const worker = async () => {
            while (cursor < texts.length) {
                const idx = cursor++;
                out[idx] = await this.embedText(texts[idx]);
            }
        };

        await Promise.all(Array.from({ length: Math.min(concurrency, texts.length) }, worker));
        return out;
    }
}
