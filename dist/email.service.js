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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
let EmailService = EmailService_1 = class EmailService {
    constructor(mailerService, configService) {
        this.mailerService = mailerService;
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
    }
    getActionButton(text, url) {
        return `
      <a href="${url}" 
         style="background-color: #4CAF50;
                color: white;
                padding: 12px 24px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                border-radius: 4px;
                margin: 10px 0;">
        ${text}
      </a>
    `;
    }
    async sendEmail(options) {
        try {
            await this.mailerService.sendMail({
                ...options,
                from: `"Lockie Visuals" <${this.configService.get('EMAIL_USER')}>`,
            });
            this.logger.log(`Email sent successfully to ${options.to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${options.to}:`, error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
    async sendContactNotification(contact) {
        await this.sendEmail({
            to: 'kidloc24chikapa@gmail.com',
            subject: 'ContactUs Message',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Contact Form Message</h2>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p><strong>From:</strong> ${contact.name} (${contact.email})</p>
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${contact.message}</p>
            <p><strong>Sent at:</strong> ${contact.createdAt.toLocaleString()}</p>
          </div>
          <p style="color: #666; margin-top: 20px;">
            You can view all messages in your admin dashboard.
          </p>
        </div>
      `,
        });
    }
    async sendBookingNotification(booking) {
        const appUrl = this.configService.get('APP_URL');
        const confirmUrl = `${appUrl}/admin/bookings/confirm/${booking.id}`;
        const rejectUrl = `${appUrl}/admin/bookings/reject/${booking.id}`;
        await this.sendEmail({
            to: 'kidloc24chikapa@gmail.com',
            subject: 'New Booking Request',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Booking Request</h2>
          <p>Service: ${booking.serviceName}</p>
          <p>User: ${booking.userEmail}</p>
          <p>Booking ID: ${booking.id}</p>
          <p>Status: ${booking.status}</p>
          <p>Created At: ${booking.createdAt}</p>
          
          <div style="margin-top: 20px;">
            ${this.getActionButton('Confirm Booking', confirmUrl)}
            ${this.getActionButton('Reject Booking', rejectUrl)}
          </div>
          
          <p style="margin-top: 20px; color: #666;">
            Or copy and paste these links in your browser:<br>
            Confirm: ${confirmUrl}<br>
            Reject: ${rejectUrl}
          </p>
        </div>
      `,
        });
    }
    async sendBookingConfirmedNotification(booking) {
        const appUrl = this.configService.get('APP_URL');
        const viewBookingUrl = `${appUrl}/bookings/${booking.id}`;
        await this.sendEmail({
            to: booking.userEmail,
            subject: 'Booking Confirmed',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Booking Confirmed</h2>
          <p>Dear Customer,</p>
          <p>Your booking for ${booking.serviceName} has been confirmed.</p>
          <p>Booking Details:</p>
          <ul>
            <li>Booking ID: ${booking.id}</li>
            <li>Service: ${booking.serviceName}</li>
            <li>Status: Confirmed</li>
          </ul>
          
          ${this.getActionButton('View Booking Details', viewBookingUrl)}
          
          <p>Thank you for choosing Lockie Visuals!</p>
        </div>
      `,
        });
    }
    async sendServiceDeliveredNotification(booking) {
        await this.sendEmail({
            to: booking.userEmail,
            subject: 'Service Delivered - Lockie Visuals',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Service Delivered</h2>
          <p>Dear Customer,</p>
          <p>We're pleased to inform you that your service has been delivered successfully.</p>
          <p>Service Details:</p>
          <ul>
            <li>Booking ID: ${booking.id}</li>
            <li>Service: ${booking.serviceName}</li>
            <li>Status: Delivered</li>
          </ul>
          <p>Thank you for choosing Lockie Visuals. We hope you're satisfied with our service!</p>
        </div>
      `,
        });
    }
    async sendVerificationEmail(email, token) {
        const appUrl = this.configService.get('APP_URL');
        const verificationUrl = `${appUrl}/verify-email?token=${token}`;
        await this.sendEmail({
            to: email,
            subject: 'Verify Your Email - Lockie Visuals',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Lockie Visuals!</h2>
          <p>Thank you for registering. Please verify your email address to complete your registration.</p>
          
          ${this.getActionButton('Verify Email', verificationUrl)}
          
          <p style="margin-top: 20px; color: #666;">
            If the button doesn't work, copy and paste this link in your browser:<br>
            ${verificationUrl}
          </p>
          <p style="color: #666;">
            This verification link will expire in 24 hours.
          </p>
        </div>
      `,
        });
    }
    async sendBookingUpdateNotification(booking) {
        const appUrl = this.configService.get('APP_URL');
        const viewBookingUrl = `${appUrl}/bookings/${booking.id}`;
        await this.sendEmail({
            to: booking.userEmail,
            subject: 'Booking Updated',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Booking Update</h2>
          <p>Dear Customer,</p>
          <p>Your booking has been updated.</p>
          <p>Booking Details:</p>
          <ul>
            <li>Booking ID: ${booking.id}</li>
            <li>Service: ${booking.serviceName}</li>
            <li>Status: ${booking.status}</li>
          </ul>
          
          ${this.getActionButton('View Updated Booking', viewBookingUrl)}
          
          <p>If you have any questions about these changes, please don't hesitate to contact us.</p>
        </div>
      `,
        });
    }
    async sendBookingCancellationNotification(booking) {
        await this.sendEmail({
            to: booking.userEmail,
            subject: 'Booking Cancelled',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Booking Cancelled</h2>
          <p>Dear Customer,</p>
          <p>Your booking has been cancelled.</p>
          <p>Booking Details:</p>
          <ul>
            <li>Booking ID: ${booking.id}</li>3
            <li>Service: ${booking.serviceName}</li>
            <li>Cancellation Date: ${new Date().toLocaleDateString()}</li>
          </ul>
          <p>If you didn't request this cancellation or have any questions, please contact us immediately.</p>
          <p>We hope to serve you again in the future.</p>
        </div>
      `,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService])
], EmailService);
