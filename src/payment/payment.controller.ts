import { Controller, Post, Get, Body, Query, Param, UseGuards, Req, Headers, RawBodyRequest } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { Request } from 'express';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    /**
     * Initialize payment - creates PayChangu checkout session
     * POST /payment/init
     */
    @Post('init')
    @UseGuards(JwtAuthGuard)
    async initPayment(@Body() body: { bookingId: number, payFull?: boolean, isBalance?: boolean }, @Req() req: any) {
        const userId = req.user.id; // Extract user ID from JWT token
        return this.paymentService.initiatePayment(body.bookingId, userId, body.payFull, body.isBalance);
    }

    /**
     * Verify payment after PayChangu redirect
     * GET /payment/verify?tx_ref=xxx&status=xxx
     */
    @Get('verify')
    async verifyPayment(@Query('tx_ref') txRef: string, @Query('status') status: string, @Req() req: any, @Headers('referer') referer: string) {
        const result = await this.verifyPaymentLogic(txRef);

        // Redirect back to dashboard with status
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const redirectUrl = new URL(`${frontendUrl}/dashboard`);

        if (result.success) {
            redirectUrl.searchParams.append('payment', 'success');
            redirectUrl.searchParams.append('type', result.type || 'deposit');
            redirectUrl.searchParams.append('bookingId', result.bookingId?.toString() || '');
        } else {
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

    // Helper to call service and return result without direct response interaction
    private async verifyPaymentLogic(txRef: string) {
        return this.paymentService.verifyPayment(txRef);
    }

    /**
     * Handle PayChangu webhook notifications
     * POST /payment/webhook
     * Note: This endpoint receives raw body for signature verification
     */
    @Post('webhook')
    async handleWebhook(
        @Headers('signature') signature: string,
        @Req() req: RawBodyRequest<Request>
    ) {
        const rawBody = req.rawBody?.toString('utf8') || '';
        return this.paymentService.handleWebhook(signature, rawBody);
    }

    /**
     * Get payment details by booking ID
     * GET /payment/:id
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getPaymentById(@Param('id') id: string) {
        return this.paymentService.getPaymentById(parseInt(id));
    }

    /**
     * Cancel payment
     * POST /payment/cancel
     */
    @Post('cancel')
    async cancelPayment(@Body() body: { tx_ref: string; reason?: string }) {
        return this.paymentService.cancelPayment(body.tx_ref, body.reason);
    }
}

