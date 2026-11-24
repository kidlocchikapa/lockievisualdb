"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GeminiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
let GeminiService = GeminiService_1 = class GeminiService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(GeminiService_1.name);
        this.embeddingModelName = 'gemini-embedding-001';
        const apiKey = this.config.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set in environment variables');
        }
        this.client = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const modelName = this.config.get('GEMINI_MODEL', 'gemini-3.6-flash');
        const fallbackModelName = this.config.get('GEMINI_FALLBACK_MODEL', 'gemini-flash-lite-latest');
        this.chatModel = this.client.getGenerativeModel({ model: modelName });
        this.fallbackChatModel = this.client.getGenerativeModel({ model: fallbackModelName });
    }
    async generateReply(systemInstruction, history, message) {
        try {
            const safeHistory = history
                .filter((t) => t.role === 'user' || t.role === 'model')
                .slice(-12)
                .map((t) => ({ role: t.role, parts: [{ text: String(t.parts?.[0]?.text ?? '') }] }))
                .filter((t) => t.parts[0].text.length > 0);
            const ask = async (model) => {
                const chat = model.startChat({
                    history: safeHistory,
                    generationConfig: {
                        temperature: 0.6,
                        maxOutputTokens: 1000,
                    },
                    systemInstruction: {
                        role: 'system',
                        parts: [{ text: systemInstruction }],
                    },
                });
                const result = await chat.sendMessage(message);
                return result.response.text();
            };
            const normalize = (text) => text && text.trim().length > 0
                ? text.trim()
                : 'Sorry, I could not come up with an answer right now. Please try again or reach us via the contact page.';
            try {
                return normalize(await ask(this.chatModel));
            }
            catch (primaryErr) {
                this.logger.warn(`Primary Gemini model failed, trying fallback: ${primaryErr?.message ?? primaryErr}`);
                return normalize(await ask(this.fallbackChatModel));
            }
        }
        catch (err) {
            this.logger.error(`Gemini generateReply failed: ${err?.message ?? err}`);
            throw new common_1.InternalServerErrorException('Loki is having trouble thinking right now. Please try again shortly.');
        }
    }
    async embedText(text) {
        try {
            const model = this.client.getGenerativeModel({ model: this.embeddingModelName });
            const result = await model.embedContent(text.slice(0, 8000));
            return Array.from(result.embedding.values ?? []);
        }
        catch (err) {
            this.logger.error(`Gemini embedText failed: ${err?.message ?? err}`);
            return [];
        }
    }
    async embedBatch(texts, concurrency = 5) {
        const out = new Array(texts.length).fill(null);
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
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = GeminiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map