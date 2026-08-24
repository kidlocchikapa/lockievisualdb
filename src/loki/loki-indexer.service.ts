import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { LokiKnowledge } from './entities/loki-knowledge.entity';
import { Service } from '../entities/service.entity';
import { Blog } from '../entities/blog.entity';
import { GeminiService } from './gemini.service';

export interface IndexedChunk {
    key: string;
    source: 'knowledge' | 'service' | 'blog';
    refId: string;
    title: string;
    text: string;
    path?: string;
    embedding: number[];
}

const CHUNK_SIZE = 1600;
const CHUNK_OVERLAP = 200;

@Injectable()
export class LokiIndexerService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(LokiIndexerService.name);
    private chunks: IndexedChunk[] = [];
    private embeddingCache = new Map<string, number[]>();
    private indexing = false;
    private refreshTimer: NodeJS.Timeout;

    constructor(
        @InjectRepository(LokiKnowledge)
        private readonly knowledgeRepo: Repository<LokiKnowledge>,
        @InjectRepository(Service)
        private readonly serviceRepo: Repository<Service>,
        @InjectRepository(Blog)
        private readonly blogRepo: Repository<Blog>,
        private readonly gemini: GeminiService,
        private readonly config: ConfigService,
    ) {}

    async onModuleInit() {
        // Fire and forget so a cold embed doesn't block boot; index fills within seconds.
        this.reindex().catch((err) => this.logger.error(`Initial reindex failed: ${err?.message ?? err}`));
        // Refresh living knowledge on a configurable schedule (LOKI_INDEXER_MINUTES, default 30; 0 disables).
        const minutes = parseInt(this.config.get<string>('LOKI_INDEXER_MINUTES', '30'), 10);
        if (minutes > 0) {
            this.refreshTimer = setInterval(() => {
                this.reindex().catch((err) => this.logger.error(`Scheduled reindex failed: ${err?.message ?? err}`));
            }, minutes * 60 * 1000);
            if (typeof this.refreshTimer.unref === 'function') this.refreshTimer.unref();
            this.logger.log(`Loki knowledge refresh scheduled every ${minutes} minute(s)`);
        }
    }

    onModuleDestroy() {
        if (this.refreshTimer) clearInterval(this.refreshTimer);
    }

    async reindex(): Promise<{ totalChunks: number }> {
        if (this.indexing) return { totalChunks: this.chunks.length };
        this.indexing = true;
        try {
            const [knowledgeRows, serviceRows, blogRows] = await Promise.all([
                this.knowledgeRepo.find({ where: { isActive: true } }),
                this.serviceRepo.find(),
                this.blogRepo.find({ where: { isPublished: true }, select: ['id', 'title', 'content', 'category', 'createdAt', 'updatedAt'] }),
            ]);

            const docs: Omit<IndexedChunk, 'embedding'>[] = [];

            for (const k of knowledgeRows) {
                docs.push({
                    key: `knowledge:${k.id}:${k.updatedAt?.getTime() ?? 0}`,
                    source: 'knowledge',
                    refId: k.id,
                    title: k.title,
                    text: `Knowledge: ${k.title}${k.category ? ` (category: ${k.category})` : ''}\n${k.content}`,
                    path: undefined,
                });
            }

            for (const s of serviceRows) {
                const price = Number(s.price);
                docs.push({
                    key: `service:${s.id}:${s.updatedAt?.getTime() ?? 0}`,
                    source: 'service',
                    refId: String(s.id),
                    title: s.title,
                    text: `Service offered by Lockie Visuals\nTitle: ${s.title}\nDescription: ${s.description}\nPrice: ${price > 0 ? `${price} MWK` : 'Contact us for a quote'}`,
                    path: '/services',
                });
            }

            for (const b of blogRows) {
                const pieces = this.chunkText(b.content || '');
                pieces.slice(0, 8).forEach((piece, i) => {
                    docs.push({
                        key: `blog:${b.id}:${i}:${b.updatedAt?.getTime() ?? 0}`,
                        source: 'blog',
                        refId: b.id,
                        title: b.title,
                        text: `Blog article "${b.title}" by Lockie Visuals${b.category ? ` (${b.category})` : ''}\n${piece}`,
                        path: `/blogs/${b.id}`,
                    });
                });
            }

            // Only embed what changed / is new
            const toEmbed: number[] = [];
            docs.forEach((d, i) => {
                if (!this.embeddingCache.has(d.key)) toEmbed.push(i);
            });

            if (toEmbed.length > 0) {
                this.logger.log(`Embedding ${toEmbed.length} new/changed chunks...`);
                const vectors = await this.gemini.embedBatch(toEmbed.map((i) => docs[i].text));
                toEmbed.forEach((docIdx, j) => {
                    if (vectors[j] && vectors[j].length > 0) {
                        this.embeddingCache.set(docs[docIdx].key, vectors[j]);
                    }
                });
            }

            this.chunks = docs
                .map((d) => ({ ...d, embedding: this.embeddingCache.get(d.key) }))
                .filter((c) => Array.isArray(c.embedding) && c.embedding.length > 0);

            this.pruneCache(docs.map((d) => d.key));
            this.logger.log(`Loki index ready: ${this.chunks.length} searchable chunks`);
            return { totalChunks: this.chunks.length };
        } finally {
            this.indexing = false;
        }
    }

    search(queryEmbedding: number[], topK = 6): IndexedChunk[] {
        if (!queryEmbedding || queryEmbedding.length === 0 || this.chunks.length === 0) return [];
        const scored = this.chunks.map((c) => ({
            chunk: c,
            score: this.cosineSimilarity(queryEmbedding, c.embedding),
        }));
        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, topK).filter((s) => s.score > 0.25).map((s) => s.chunk);
    }

    private chunkText(text: string): string[] {
        const clean = (text || '').replace(/\s+/g, ' ').trim();
        if (!clean) return [];
        if (clean.length <= CHUNK_SIZE) return [clean];
        const pieces: string[] = [];
        let start = 0;
        while (start < clean.length && pieces.length < 8) {
            pieces.push(clean.slice(start, start + CHUNK_SIZE));
            start += CHUNK_SIZE - CHUNK_OVERLAP;
        }
        return pieces;
    }

    private pruneCache(validKeys: string[]) {
        const valid = new Set(validKeys);
        for (const key of this.embeddingCache.keys()) {
            if (!valid.has(key)) this.embeddingCache.delete(key);
        }
    }

    private cosineSimilarity(a: number[], b: number[]): number {
        let dot = 0;
        const len = Math.min(a.length, b.length);
        for (let i = 0; i < len; i++) dot += a[i] * b[i];
        return dot / ((Math.hypot(...a) * Math.hypot(...b)) || 1);
    }
}
