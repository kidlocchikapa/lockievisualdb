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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bookings_entity_1 = require("../entities/bookings.entity");
const axios_1 = require("axios");
const crypto = require("crypto");
let PaymentService = class PaymentService {
    constructor(bookingRepository, configService) {
        this.bookingRepository = bookingRepository;
        this.configService = configService;
        this.payChanguApiUrl = 'https://api.paychangu.com';
        this.payChanguSecretKey = this.configService.get('PAYCHANGU_SECRET_KEY');
        this.payChanguWebhookSecret = this.configService.get('PAYCHANGU_WEBHOOK_SECRET');
        this.payChanguCurrency = this.configService.get('PAYCHANGU_CURRENCY') || 'MWK';
        this.callbackUrl = this.configService.get('CALLBACK_URL');
        this.frontendUrl = this.configService.get('FRONTEND_URL');
    }
    async pcFetch(path, options = {}) {
        try {
            const response = await (0, axios_1.default)({
                url: `${this.payChanguApiUrl}${path}`,
                ...options,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.payChanguSecretKey}`,
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('PayChangu API Error:', {
                status: error.response?.status,
                data: error.response?.data
            });
            const errorMsg = error.response?.data?.message ||
                (typeof error.response?.data?.error === 'string' ? error.response.data.error : null) ||
                (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : null) ||
                `PayChangu error (${error.response?.status || 'unknown'})`;
            throw new common_1.InternalServerErrorException(errorMsg);
        }
    }
    async initiatePayment(bookingId, userId) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId },
            relations: ['user']
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.user.id !== userId) {
            throw new common_1.BadRequestException('You are not authorized to make payment for this booking');
        }
        const amount = booking.totalAmount > 0 ? booking.totalAmount * 0.5 : 60000;
        const txRef = `LV-${booking.id}-${Date.now()}`;
        const payload = {
            amount: String(amount),
            currency: this.payChanguCurrency,
            email: booking.userEmail,
            first_name: booking.userEmail.split('@')[0],
            last_name: 'Customer',
            callback_url: this.callbackUrl,
            return_url: this.frontendUrl,
            tx_ref: txRef,
            customization: {
                title: 'Lockie Visuals Service Payment',
                description: booking.serviceName
            },
            meta: {
                bookingId: String(booking.id),
                serviceName: booking.serviceName
            }
        };
        console.log('Initiating PayChangu payment with payload:', JSON.stringify(payload, null, 2));
        const response = await this.pcFetch('/payment', {
            method: 'POST',
            data: payload
        });
        const checkoutUrl = response?.data?.checkout_url;
        if (!checkoutUrl) {
            throw new common_1.InternalServerErrorException('No checkout_url returned by PayChangu');
        }
        booking.transactionReference = txRef;
        booking.paymentStatus = bookings_entity_1.PaymentStatus.PENDING;
        await this.bookingRepository.save(booking);
        return {
            success: true,
            message: 'Checkout session created',
            checkout_url: checkoutUrl,
            tx_ref: txRef
        };
    }
    async verifyPayment(txRef) {
        if (!txRef) {
            throw new common_1.BadRequestException('tx_ref is required');
        }
        try {
            const verifyResponse = await this.pcFetch(`/verify-payment/${encodeURIComponent(txRef)}`, {
                method: 'GET'
            });
            const isSuccess = verifyResponse?.status === 'success' && verifyResponse?.data?.status === 'success';
            const amount = verifyResponse?.data?.amount;
            const currency = verifyResponse?.data?.currency;
            const booking = await this.bookingRepository.findOne({
                where: { transactionReference: txRef }
            });
            if (booking) {
                const expectedAmount = booking.totalAmount > 0 ? booking.totalAmount * 0.5 : 60000;
                if (isSuccess && Number(amount) === Number(expectedAmount) && currency === this.payChanguCurrency) {
                    booking.paymentStatus = bookings_entity_1.PaymentStatus.PARTIAL;
                    booking.amountPaid = Number(amount);
                }
                else if (!isSuccess) {
                    booking.paymentStatus = bookings_entity_1.PaymentStatus.FAILED;
                }
                booking.additionalDetails = {
                    ...booking.additionalDetails,
                    paymentMeta: verifyResponse?.data || {}
                };
                await this.bookingRepository.save(booking);
            }
            return {
                success: isSuccess,
                message: isSuccess ? 'Payment verified successfully' : 'Payment verification failed',
                booking
            };
        }
        catch (error) {
            console.error('Payment verification error:', error);
            throw new common_1.InternalServerErrorException('Verification failed');
        }
    }
    async handleWebhook(signature, rawBody) {
        if (!this.payChanguWebhookSecret) {
            console.warn('No PAYCHANGU_WEBHOOK_SECRET configured');
            throw new common_1.BadRequestException('Webhook secret not configured');
        }
        const computed = crypto
            .createHmac('sha256', this.payChanguWebhookSecret)
            .update(rawBody)
            .digest('hex');
        if (computed !== signature) {
            console.warn('Invalid webhook signature');
            throw new common_1.BadRequestException('Invalid signature');
        }
        const event = JSON.parse(rawBody);
        const txRef = event?.data?.tx_ref || event?.tx_ref;
        const status = event?.data?.status || event?.status;
        if (!txRef) {
            return { success: true, message: 'No tx_ref in webhook' };
        }
        const booking = await this.bookingRepository.findOne({
            where: { transactionReference: txRef }
        });
        if (!booking) {
            return { success: true, message: 'Booking not found' };
        }
        if (status === 'success') {
            booking.paymentStatus = bookings_entity_1.PaymentStatus.PARTIAL;
            booking.amountPaid = event?.data?.amount || booking.amountPaid;
        }
        else if (status === 'failed' || status === 'cancelled' || status === 'canceled') {
            booking.paymentStatus = bookings_entity_1.PaymentStatus.FAILED;
        }
        booking.additionalDetails = {
            ...booking.additionalDetails,
            paymentMeta: event?.data || event
        };
        await this.bookingRepository.save(booking);
        return { success: true, message: 'Webhook processed' };
    }
    async getPaymentById(bookingId) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId },
            relations: ['user']
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return {
            success: true,
            payment: {
                paymentStatus: booking.paymentStatus,
                transactionReference: booking.transactionReference,
                amountPaid: booking.amountPaid,
                totalAmount: booking.totalAmount,
                paymentMeta: booking.additionalDetails?.paymentMeta || {},
                serviceName: booking.serviceName,
                userEmail: booking.userEmail
            }
        };
    }
    async cancelPayment(txRef, reason) {
        if (!txRef) {
            throw new common_1.BadRequestException('tx_ref is required');
        }
        const booking = await this.bookingRepository.findOne({
            where: { transactionReference: txRef }
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking/payment not found');
        }
        booking.paymentStatus = bookings_entity_1.PaymentStatus.FAILED;
        booking.additionalDetails = {
            ...booking.additionalDetails,
            canceledAt: new Date(),
            cancelReason: reason || 'Payment failed or canceled'
        };
        await this.bookingRepository.save(booking);
        return {
            success: true,
            message: 'Payment marked as failed/canceled',
            paymentStatus: booking.paymentStatus
        };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bookings_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map