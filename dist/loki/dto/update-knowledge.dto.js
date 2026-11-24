"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateKnowledgeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_knowledge_dto_1 = require("./create-knowledge.dto");
class UpdateKnowledgeDto extends (0, mapped_types_1.PartialType)(create_knowledge_dto_1.CreateKnowledgeDto) {
}
exports.UpdateKnowledgeDto = UpdateKnowledgeDto;
//# sourceMappingURL=update-knowledge.dto.js.map