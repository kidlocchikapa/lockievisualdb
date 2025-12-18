import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Booking } from './entities/bookings.entity';
import { Contact } from './entities/contact.entity';
import { join } from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly logoPath = join(process.cwd(), '..', 'src', 'assets', 'images', 'LogoImage.png');

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) { }

  private getEmailHeader(): string {
    return `
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="cid:logo" alt="Lockie Visuals Logo" style="width: 150px; height: auto;" />
      </div>
      <hr style="border: 0; border-top: 1px solid #eee; margin-bottom: 20px;">
    `;
  }

  private getEmailFooter(): string {
    return `
      <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px; margin-bottom: 20px;">
      <div style="text-align: center; color: #888; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Lockie Visuals. All rights reserved.</p>
        <p>Blantyre, Malawi</p>
      </div>
    `;
  }

  private getActionButton(text: string, url: string, color: string = '#f57c00'): string {
    return `
      <div style="text-align: center; margin: 25px 0;">
        <a href="${url}" 
           style="background-color: ${color};
                  color: white;
                  padding: 12px 28px;
                  text-align: center;
                  text-decoration: none;
                  display: inline-block;
                  border-radius: 6px;
                  font-weight: bold;
                  font-size: 16px;">
          ${text}
        </a>
      </div>
    `;
  }

  private async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    try {
      await this.mailerService.sendMail({
        ...options,
        from: `"Lockie Visuals" <${this.configService.get('EMAIL_USER')}>`,
        attachments: [
          {
            filename: 'logo.png',
            path: this.logoPath,
            cid: 'logo',
          },
        ],
      });
      this.logger.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      // Don't throw to prevent blocking the main process, but log it
    }
  }

  async sendContactNotification(contact: Contact): Promise<void> {
    await this.sendEmail({
      to: 'kidloc24chikapa@gmail.com', // Your admin email
      subject: 'New Contact Form Message - Lockie Visuals',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
          ${this.getEmailHeader()}
          <h2 style="color: #f57c00;">New Contact Form Message</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
            <p><strong>From:</strong> ${contact.name} (${contact.email})</p>
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 5px; border: 1px solid #eee;">${contact.message}</p>
            <p><strong>Sent at:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
          </div>
          <p style="color: #666; margin-top: 20px;">
            You can view all messages in your admin dashboard.
          </p>
          ${this.getEmailFooter()}
        </div>
      `,
    });
  }

  async sendBookingNotification(booking: Booking): Promise<void> {
    const appUrl = this.configService.get('APP_URL');
    const confirmUrl = `${appUrl}/admin/bookings/${booking.id}/confirm`;
    const rejectUrl = `${appUrl}/admin/bookings/${booking.id}/cancel`;

    await this.sendEmail({
      to: 'kidloc24chikapa@gmail.com',
      subject: 'New Booking Request - Lockie Visuals',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
          ${this.getEmailHeader()}
          <h2 style="color: #f57c00;">New Booking Request</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
            <p><strong>Service:</strong> ${booking.serviceName}</p>
            <p><strong>Customer:</strong> ${booking.userEmail}</p>
            <p><strong>Booking ID:</strong> #LV-${booking.id}</p>
            <p><strong>Status:</strong> <span style="color: #f57c00; font-weight: bold;">${booking.status}</span></p>
            <p><strong>Requested At:</strong> ${new Date(booking.createdAt).toLocaleString()}</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="font-weight: bold;">Quick Actions:</p>
            <div style="display: inline-block;">
                ${this.getActionButton('Confirm Booking', confirmUrl, '#4CAF50')}
            </div>
            <div style="display: inline-block; margin-left: 10px;">
                ${this.getActionButton('Reject Booking', rejectUrl, '#F44336')}
            </div>
          </div>
          
          <p style="margin-top: 25px; color: #666; font-size: 13px; text-align: center;">
            Direct links (copy & paste):<br>
            Confirm: ${confirmUrl}<br>
            Reject: ${rejectUrl}
          </p>
          ${this.getEmailFooter()}
        </div>
      `,
    });
  }

  async sendBookingConfirmedNotification(booking: Booking): Promise<void> {
    const appUrl = this.configService.get('APP_URL');
    // Updated booking view URL to match the pattern
    const viewBookingUrl = `${appUrl}/admin/bookings/${booking.id}/view`;

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

  async sendServiceDeliveredNotification(booking: Booking): Promise<void> {
    const appUrl = this.configService.get('APP_URL');
    const viewBookingUrl = `${appUrl}/admin/bookings/${booking.id}/view`;

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
          
          ${this.getActionButton('View Service Details', viewBookingUrl)}
          
          <p>Thank you for choosing Lockie Visuals. We hope you're satisfied with our service!</p>
        </div>
      `,
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const appUrl = this.configService.get('APP_URL');
    const verificationUrl = `${appUrl}/auth/verify-email?token=${token}`;
    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email - Lockie Visuals',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
          ${this.getEmailHeader()}
          <h2 style="color: #f57c00;">Welcome to Lockie Visuals!</h2>
          <p>Hi there,</p>
          <p>Thank you for registering. Please verify your email address to complete your registration and start booking our premium services.</p>
          
          ${this.getActionButton('Verify Email Address', verificationUrl)}
          
          <p style="margin-top: 20px; color: #666; font-size: 13px;">
            If the button above does not work, please copy and paste this link into your browser:<br>
            <a href="${verificationUrl}">${verificationUrl}</a>
          </p>
          <p style="color: #999; font-size: 12px;">
            This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
          </p>
          ${this.getEmailFooter()}
        </div>
      `,
    });
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    const appUrl = this.configService.get('APP_URL');
    const resetUrl = `${appUrl}/reset-password?token=${token}`;
    await this.sendEmail({
      to: email,
      subject: 'Reset Your Password - Lockie Visuals',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
          ${this.getEmailHeader()}
          <h2 style="color: #f57c00;">Password Reset Request</h2>
          <p>Hi there,</p>
          <p>We received a request to reset the password for your Lockie Visuals account. Click the button below to set a new password:</p>
          
          ${this.getActionButton('Reset Password', resetUrl)}
          
          <p style="margin-top: 20px; color: #666; font-size: 13px;">
            If the button above does not work, please copy and paste this link into your browser:<br>
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
          <p style="color: #999; font-size: 12px;">
            This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact support if you have concerns.
          </p>
          ${this.getEmailFooter()}
        </div>
      `,
    });
  }

  async sendBookingUpdateNotification(booking: Booking): Promise<void> {
    const appUrl = this.configService.get('APP_URL');
    // Updated booking view URL
    const viewBookingUrl = `${appUrl}/admin/bookings/${booking.id}/view`;

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

  async sendBookingCancellationNotification(booking: Booking): Promise<void> {
    const appUrl = this.configService.get('APP_URL');
    const viewBookingUrl = `${appUrl}/admin/bookings/${booking.id}/view`;

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
            <li>Booking ID: ${booking.id}</li>
            <li>Service: ${booking.serviceName}</li>
            <li>Cancellation Date: ${new Date().toLocaleDateString()}</li>
          </ul>
          
          ${this.getActionButton('View Booking Details', viewBookingUrl)}
          
          <p>If you didn't request this cancellation or have any questions, please contact us immediately.</p>
          <p>We hope to serve you again in the future.</p>
        </div>
      `,
    });
  }

  async sendFeedbackResponseEmail(email: string, content: string, response: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'New Response to Your Feedback - Lockie Visuals',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
          ${this.getEmailHeader()}
          <h2 style="color: #f57c00;">Response to Your Feedback</h2>
          <p>Hi there,</p>
          <p>An admin has responded to the feedback you shared with us:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eee; margin: 15px 0;">
            <p><strong>Your Feedback:</strong></p>
            <p style="font-style: italic;">"${content}"</p>
          </div>
          <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; border: 1px solid #ffe0b2; margin: 15px 0;">
            <p><strong>Admin Response:</strong></p>
            <p>${response}</p>
          </div>
          <p>Thank you for your valuable input. We're always working to improve our services!</p>
          ${this.getEmailFooter()}
        </div>
      `,
    });
  }
}