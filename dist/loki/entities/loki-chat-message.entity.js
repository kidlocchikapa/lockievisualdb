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
exports.LokiChatMessage = void 0;
const typeorm_1 = require("typeorm");
const loki_chat_session_entity_1 = require("./loki-chat-session.entity");
let LokiChatMessage = class LokiChatMessage {
};
exports.LokiChatMessage = LokiChatMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LokiChatMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], LokiChatMessage.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => loki_chat_session_entity_1.LokiChatSession, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'sessionId' }),
    __metadata("design:type", loki_chat_session_entity_1.LokiChatSession)
], LokiChatMessage.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LokiChatMessage.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], LokiChatMessage.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LokiChatMessage.prototype, "createdAt", void 0);
exports.LokiChatMessage = LokiChatMessage = __decorate([
    (0, typeorm_1.Entity)('loki_chat_messages')
], LokiChatMessage);
//# sourceMappingURL=loki-chat-message.entity.js.map