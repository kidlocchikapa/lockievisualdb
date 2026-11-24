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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LokiIndexerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LokiIndexerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const loki_knowledge_entity_1 = require("./entities/loki-knowledge.entity");
const service_entity_1 = require("../entities/service.entity");
const blog_entity_1 = require("../entities/blog.entity");
const gemini_service_1 = require("./gemini.service");
const CHUNK_SIZE = 1600;
const CHUNK_OVERLAP = 200;
let LokiIndexerService = LokiIndexerService_1 = class LokiIndexerService {
    constructor(knowledgeRepo, serviceRepo, blogRepo, gemini, config) {
        this.knowledgeRepo = knowledgeRepo;
        this.serviceRepo = serviceRepo;
        this.blogRepo = blogRepo;
        this.gemini = gemini;
        this.config = config;
        this.logger = new common_1.Logger(LokiIndexerService_1.name);
        this.chunks = [];
        this.embeddingCache = new Map();
        this.indexing = false;
    }
    async onModuleInit() {
        this.reindex().catch((err) => this.logger.error(`Initial reindex failed: ${err?.message ?? err}`));
        const minutes = parseInt(this.config.get('LOKI_INDEXER_MINUTES', '30'), 10);
        if (minutes > 0) {
            this.refreshTimer = setInterval(() => {
                this.reindex().catch((err) => this.logger.error(`Scheduled reindex failed: ${err?.message ?? err}`));
            }, minutes * 60 * 1000);
            if (typeof this.refreshTimer.unref === 'function')
                this.refreshTimer.unref();
            this.logger.log(`Loki knowledge refresh scheduled every ${minutes} minute(s)`);
        }
    }
    onModuleDestroy() {
        if (this.refreshTimer)
            clearInterval(this.refreshTimer);
    }
    async reindex() {
        if (this.indexing)
            return { totalChunks: this.chunks.length };
        this.indexing = true;
        try {
            const [knowledgeRows, serviceRows, blogRows] = await Promise.all([
                this.knowledgeRepo.find({ where: { isActive: true } }),
                this.serviceRepo.find(),
                this.blogRepo.find({ where: { isPublished: true }, select: ['id', 'title', 'content', 'category', 'createdAt', 'updatedAt'] }),
            ]);
            const docs = [];
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
            const toEmbed = [];
            docs.forEach((d, i) => {
                if (!this.embeddingCache.has(d.key))
                    toEmbed.push(i);
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
        }
        finally {
            this.indexing = false;
        }
    }
    search(queryEmbedding, topK = 6) {
        if (!queryEmbedding || queryEmbedding.length === 0 || this.chunks.length === 0)
            return [];
        const scored = this.chunks.map((c) => ({
            chunk: c,
            score: this.cosineSimilarity(queryEmbedding, c.embedding),
        }));
        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, topK).filter((s) => s.score > 0.25).map((s) => s.chunk);
    }
    chunkText(text) {
        const clean = (text || '').replace(/\s+/g, ' ').trim();
        if (!clean)
            return [];
        if (clean.length <= CHUNK_SIZE)
            return [clean];
        const pieces = [];
        let start = 0;
        while (start < clean.length && pieces.length < 8) {
            pieces.push(clean.slice(start, start + CHUNK_SIZE));
            start += CHUNK_SIZE - CHUNK_OVERLAP;
        }
        return pieces;
    }
    pruneCache(validKeys) {
        const valid = new Set(validKeys);
        for (const key of this.embeddingCache.keys()) {
            if (!valid.has(key))
                this.embeddingCache.delete(key);
        }
    }
    cosineSimilarity(a, b) {
        let dot = 0;
        const len = Math.min(a.length, b.length);
        for (let i = 0; i < len; i++)
            dot += a[i] * b[i];
        return dot / ((Math.hypot(...a) * Math.hypot(...b)) || 1);
    }
};
exports.LokiIndexerService = LokiIndexerService;
exports.LokiIndexerService = LokiIndexerService = LokiIndexerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(loki_knowledge_entity_1.LokiKnowledge)),
    __param(1, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __param(2, (0, typeorm_1.InjectRepository)(blog_entity_1.Blog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        gemini_service_1.GeminiService,
        config_1.ConfigService])
], LokiIndexerService);
//# sourceMappingURL=loki-indexer.service.js.map