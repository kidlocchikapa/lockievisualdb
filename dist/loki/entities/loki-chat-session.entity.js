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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LokiChatSession = void 0;
const typeorm_1 = require("typeorm");
let LokiChatSession = class LokiChatSession {
};
exports.LokiChatSession = LokiChatSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LokiChatSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], LokiChatSession.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], LokiChatSession.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'New chat' }),
    __metadata("design:type", String)
], LokiChatSession.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], LokiChatSession.prototype, "lastMessageAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LokiChatSession.prototype, "createdAt", void 0);
exports.LokiChatSession = LokiChatSession = __decorate([
    (0, typeorm_1.Entity)('loki_chat_sessions')
], LokiChatSession);
//# sourceMappingURL=loki-chat-session.entity.js.map