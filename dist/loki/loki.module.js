"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LokiModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const loki_knowledge_entity_1 = require("./entities/loki-knowledge.entity");
const loki_chat_session_entity_1 = require("./entities/loki-chat-session.entity");
const loki_chat_message_entity_1 = require("./entities/loki-chat-message.entity");
const service_entity_1 = require("../entities/service.entity");
const blog_entity_1 = require("../entities/blog.entity");
const gemini_service_1 = require("./gemini.service");
const loki_indexer_service_1 = require("./loki-indexer.service");
const loki_service_1 = require("./loki.service");
const loki_knowledge_service_1 = require("./loki-knowledge.service");
const loki_controller_1 = require("./loki.controller");
let LokiModule = class LokiModule {
};
exports.LokiModule = LokiModule;
exports.LokiModule = LokiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([loki_knowledge_entity_1.LokiKnowledge, loki_chat_session_entity_1.LokiChatSession, loki_chat_message_entity_1.LokiChatMessage, service_entity_1.Service, blog_entity_1.Blog]),
        ],
        controllers: [loki_controller_1.LokiController],
        providers: [gemini_service_1.GeminiService, loki_indexer_service_1.LokiIndexerService, loki_service_1.LokiService, loki_knowledge_service_1.LokiKnowledgeService],
        exports: [loki_service_1.LokiService],
    })
], LokiModule);
//# sourceMappingURL=loki.module.js.map