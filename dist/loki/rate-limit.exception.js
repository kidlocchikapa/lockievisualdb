"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitException = void 0;
const common_1 = require("@nestjs/common");
class RateLimitException extends common_1.HttpException {
    constructor(message) {
        super({ statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS, message }, common_1.HttpStatus.TOO_MANY_REQUESTS);
    }
}
exports.RateLimitException = RateLimitException;
//# sourceMappingURL=rate-limit.exception.js.map