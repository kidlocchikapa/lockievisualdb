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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const jwt_auth_guard_1 = require("../auth/jwt.auth-guard");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async initPayment(body, req) {
        const userId = req.user.id;
        return this.paymentService.initiatePayment(body.bookingId, userId, body.payFull, body.isBalance);
    }
    async verifyPayment(txRef, status, req, referer) {
        const result = await this.verifyPaymentLogic(txRef);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const redirectUrl = new URL(`${frontendUrl}/dashboard`);
        if (result.success) {
            redirectUrl.searchParams.append('payment', 'success');
            redirectUrl.searchParams.append('type', result.type || 'deposit');
            redirectUrl.searchParams.append('bookingId', result.bookingId?.toString() || '');
        }
        else {
            redirectUrl.searchParams.append('payment', 'failed');
            redirectUrl.searchParams.append('reason', result.message || 'Verification failed');
        }
        return `
            <html>
                <head>
                    <title>Redirecting...</title>
                    <script>
                        window.location.href = "${redirectUrl.toString()}";
                    </script>
                </head>
                <body>
                    <p>Redirecting back to dashboard... If not redirected, <a href="${redirectUrl.toString()}">click here</a>.</p>
                </body>
            </html>
        `;
    }
    async verifyPaymentLogic(txRef) {
        return this.paymentService.verifyPayment(txRef);
    }
    async handleWebhook(signature, req) {
        const rawBody = req.rawBody?.toString('utf8') || '';
        return this.paymentService.handleWebhook(signature, rawBody);
    }
    async getPaymentById(id) {
        return this.paymentService.getPaymentById(parseInt(id));
    }
    async cancelPayment(body) {
        return this.paymentService.cancelPayment(body.tx_ref, body.reason);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('init'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "initPayment", null);
__decorate([
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Query)('tx_ref')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Headers)('referer')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Headers)('signature')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentById", null);
__decorate([
    (0, common_1.Post)('cancel'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "cancelPayment", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map