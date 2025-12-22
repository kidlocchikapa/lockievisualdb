import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, PaymentStatus } from '../entities/bookings.entity';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
    private payChanguSecretKey: string;
    private payChanguWebhookSecret: string;
    private payChanguCurrency: string;
    private callbackUrl: string;
    private frontendUrl: string;
    private payChanguApiUrl = 'https://api.paychangu.com';

    constructor(
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
        private configService: ConfigService
    ) {
        this.payChanguSecretKey = this.configService.get<string>('PAYCHANGU_SECRET_KEY');
        this.payChanguWebhookSecret = this.configService.get<string>('PAYCHANGU_WEBHOOK_SECRET');
        this.payChanguCurrency = this.configService.get<string>('PAYCHANGU_CURRENCY') || 'MWK';
        this.callbackUrl = this.configService.get<string>('CALLBACK_URL');
        this.frontendUrl = this.configService.get<string>('FRONTEND_URL');
    }

    /**
     * Helper function to make authenticated requests to PayChangu API
     */
    private async pcFetch(path: string, options: any = {}) {
        try {
            const response = await axios({
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
        } catch (error) {
            console.error('PayChangu API Error:', {
                status: error.response?.status,
                data: error.response?.data
            });

            const errorMsg = error.response?.data?.message ||
                (typeof error.response?.data?.error === 'string' ? error.response.data.error : null) ||
                (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : null) ||
                `PayChangu error (${error.response?.status || 'unknown'})`;

            throw new InternalServerErrorException(errorMsg);
        }
    }

    /**
     * Initialize payment - creates PayChangu checkout session
     */
    async initiatePayment(bookingId: number, userId: number, payFull: boolean = false, isBalance: boolean = false) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId },
            relations: ['user']
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.user.id !== userId) {
            throw new BadRequestException('You are not authorized to make payment for this booking');
        }

        // Calculate amount
        let amount = 0;
        let type = 'deposit';

        if (isBalance) {
            amount = booking.totalAmount - (booking.amountPaid || 0);
            type = 'balance';
        } else if (payFull) {
            amount = booking.totalAmount;
            type = 'full';
        } else {
            // Default 50% deposit
            amount = booking.totalAmount > 0 ? booking.totalAmount * 0.5 : 60000;
            type = 'deposit';
        }

        if (amount <= 0) {
            throw new BadRequestException('Payment amount must be greater than 0');
        }

        const txRef = `LV-${booking.id}-${type}-${Date.now()}`;

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
                serviceName: booking.serviceName,
                paymentType: type
            }
        };

        console.log('Initiating PayChangu payment with payload:', JSON.stringify(payload, null, 2));

        // Call PayChangu API to create checkout session
        const response = await this.pcFetch('/payment', {
            method: 'POST',
            data: payload
        });

        const checkoutUrl = response?.data?.checkout_url;
        if (!checkoutUrl) {
            throw new InternalServerErrorException('No checkout_url returned by PayChangu');
        }

        // Update booking with payment reference
        booking.transactionReference = txRef;
        booking.paymentStatus = PaymentStatus.PENDING;
        await this.bookingRepository.save(booking);

        return {
            success: true,
            message: 'Checkout session created',
            checkout_url: checkoutUrl,
            tx_ref: txRef
        };
    }

    /**
     * Verify payment after redirect from PayChangu
     */
    async verifyPayment(txRef: string) {
        if (!txRef) {
            throw new BadRequestException('tx_ref is required');
        }

        try {
            // Call PayChangu verification endpoint
            const verifyResponse = await this.pcFetch(`/verify-payment/${encodeURIComponent(txRef)}`, {
                method: 'GET'
            });

            const isSuccess = verifyResponse?.status === 'success' && verifyResponse?.data?.status === 'success';
            const amount = verifyResponse?.data?.amount;
            const currency = verifyResponse?.data?.currency;

            // Find booking by transaction reference
            const booking = await this.bookingRepository.findOne({
                where: { transactionReference: txRef }
            });

            if (booking) {
                const txRefParts = txRef.split('-');
                const paymentType = txRefParts[2] || 'deposit'; // LV-ID-TYPE-TIMESTAMP

                if (isSuccess && currency === this.payChanguCurrency) {
                    const paidAmount = Number(amount);
                    booking.amountPaid = (Number(booking.amountPaid) || 0) + paidAmount;

                    if (booking.amountPaid >= booking.totalAmount) {
                        booking.paymentStatus = PaymentStatus.PAID;
                    } else {
                        booking.paymentStatus = PaymentStatus.PARTIAL;
                    }
                } else if (!isSuccess) {
                    booking.paymentStatus = PaymentStatus.FAILED;
                }

                // Store payment metadata
                booking.additionalDetails = {
                    ...booking.additionalDetails,
                    paymentMeta: verifyResponse?.data || {}
                };

                await this.bookingRepository.save(booking);

                return {
                    success: isSuccess,
                    message: isSuccess ? 'Payment verified successfully' : 'Payment verification failed',
                    bookingId: booking.id,
                    type: paymentType
                };
            }

            return {
                success: isSuccess,
                message: isSuccess ? 'Payment verified successfully' : 'Payment verification failed',
                type: 'unknown'
            };
        } catch (error) {
            console.error('Payment verification error:', error);
            throw new InternalServerErrorException('Verification failed');
        }
    }

    /**
     * Handle PayChangu webhook notifications
     */
    async handleWebhook(signature: string, rawBody: string) {
        if (!this.payChanguWebhookSecret) {
            console.warn('No PAYCHANGU_WEBHOOK_SECRET configured');
            throw new BadRequestException('Webhook secret not configured');
        }

        // Verify HMAC signature
        const computed = crypto
            .createHmac('sha256', this.payChanguWebhookSecret)
            .update(rawBody)
            .digest('hex');

        if (computed !== signature) {
            console.warn('Invalid webhook signature');
            throw new BadRequestException('Invalid signature');
        }

        // Parse webhook event
        const event = JSON.parse(rawBody);
        const txRef = event?.data?.tx_ref || event?.tx_ref;
        const status = event?.data?.status || event?.status;

        if (!txRef) {
            return { success: true, message: 'No tx_ref in webhook' };
        }

        // Find and update booking
        const booking = await this.bookingRepository.findOne({
            where: { transactionReference: txRef }
        });

        if (!booking) {
            return { success: true, message: 'Booking not found' };
        }

        // Update payment status based on webhook event
        if (status === 'success') {
            booking.paymentStatus = PaymentStatus.PARTIAL;
            booking.amountPaid = event?.data?.amount || booking.amountPaid;
        } else if (status === 'failed' || status === 'cancelled' || status === 'canceled') {
            booking.paymentStatus = PaymentStatus.FAILED;
        }

        // Store webhook data
        booking.additionalDetails = {
            ...booking.additionalDetails,
            paymentMeta: event?.data || event
        };

        await this.bookingRepository.save(booking);

        return { success: true, message: 'Webhook processed' };
    }

    /**
     * Get payment details by booking ID
     */
    async getPaymentById(bookingId: number) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId },
            relations: ['user']
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
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

    /**
     * Cancel payment
     */
    async cancelPayment(txRef: string, reason?: string) {
        if (!txRef) {
            throw new BadRequestException('tx_ref is required');
        }

        const booking = await this.bookingRepository.findOne({
            where: { transactionReference: txRef }
        });

        if (!booking) {
            throw new NotFoundException('Booking/payment not found');
        }

        booking.paymentStatus = PaymentStatus.FAILED;
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
}

