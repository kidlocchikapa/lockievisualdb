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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LokiController = void 0;
const common_1 = require("@nestjs/common");
const loki_service_1 = require("./loki.service");
const loki_indexer_service_1 = require("./loki-indexer.service");
const chat_dto_1 = require("./dto/chat.dto");
const create_knowledge_dto_1 = require("./dto/create-knowledge.dto");
const update_knowledge_dto_1 = require("./dto/update-knowledge.dto");
const jwt_auth_guard_1 = require("../auth/jwt.auth-guard");
const roles_guards_1 = require("../auth/roles.guards");
const decolators_1 = require("../decolators");
const loki_knowledge_service_1 = require("./loki-knowledge.service");
let LokiController = class LokiController {
    constructor(lokiService, indexer, knowledgeService) {
        this.lokiService = lokiService;
        this.indexer = indexer;
        this.knowledgeService = knowledgeService;
    }
    identity(req) {
        const deviceId = req.headers['x-loki-device'] ? String(req.headers['x-loki-device']) : undefined;
        const reqAny = req;
        const userId = reqAny?.user?.id ? String(reqAny.user.id) : undefined;
        return { deviceId, userId };
    }
    chat(req, body) {
        const { deviceId, userId } = this.identity(req);
        return this.lokiService.chat({
            message: body.message,
            sessionId: body.sessionId,
            deviceId,
            userId,
        });
    }
    sessions(req) {
        const { deviceId, userId } = this.identity(req);
        return this.lokiService.listSessions(deviceId, userId);
    }
    sessionMessages(req, id) {
        const { deviceId, userId } = this.identity(req);
        return this.lokiService.getSessionMessages(id, deviceId, userId);
    }
    deleteSession(req, id) {
        const { deviceId, userId } = this.identity(req);
        return this.lokiService.deleteSession(id, deviceId, userId);
    }
    listKnowledge() {
        return this.knowledgeService.findAll();
    }
    async createKnowledge(dto) {
        const created = await this.knowledgeService.create(dto);
        await this.indexer.reindex();
        return created;
    }
    async updateKnowledge(id, dto) {
        const updated = await this.knowledgeService.update(id, dto);
        await this.indexer.reindex();
        return updated;
    }
    async deleteKnowledge(id) {
        await this.knowledgeService.remove(id);
        await this.indexer.reindex();
        return { deleted: true };
    }
    reindex() {
        return this.indexer.reindex();
    }
};
exports.LokiController = LokiController;
__decorate([
    (0, common_1.Post)('chat'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, chat_dto_1.LokiChatDto]),
    __metadata("design:returntype", void 0)
], LokiController.prototype, "chat", null);
__decorate([
    (0, common_1.Get)('sessions'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LokiController.prototype, "sessions", null);
__decorate([
    (0, common_1.Get)('sessions/:id/messages'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LokiController.prototype, "sessionMessages", null);
__decorate([
    (0, common_1.Delete)('sessions/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LokiController.prototype, "deleteSession", null);
__decorate([
    (0, common_1.Get)('admin/knowledge'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guards_1.RolesGuard),
    (0, decolators_1.Roles)(decolators_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LokiController.prototype, "listKnowledge", null);
__decorate([
    (0, common_1.Post)('admin/knowledge'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guards_1.RolesGuard),
    (0, decolators_1.Roles)(decolators_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_knowledge_dto_1.CreateKnowledgeDto]),
    __metadata("design:returntype", Promise)
], LokiController.prototype, "createKnowledge", null);
__decorate([
    (0, common_1.Put)('admin/knowledge/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guards_1.RolesGuard),
    (0, decolators_1.Roles)(decolators_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_knowledge_dto_1.UpdateKnowledgeDto]),
    __metadata("design:returntype", Promise)
], LokiController.prototype, "updateKnowledge", null);
__decorate([
    (0, common_1.Delete)('admin/knowledge/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guards_1.RolesGuard),
    (0, decolators_1.Roles)(decolators_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LokiController.prototype, "deleteKnowledge", null);
__decorate([
    (0, common_1.Post)('admin/reindex'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guards_1.RolesGuard),
    (0, decolators_1.Roles)(decolators_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LokiController.prototype, "reindex", null);
exports.LokiController = LokiController = __decorate([
    (0, common_1.Controller)('loki'),
    __metadata("design:paramtypes", [loki_service_1.LokiService,
        loki_indexer_service_1.LokiIndexerService,
        loki_knowledge_service_1.LokiKnowledgeService])
], LokiController);
//# sourceMappingURL=loki.controller.js.map