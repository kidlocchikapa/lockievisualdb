import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Booking } from './entities/bookings.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private getActionButton(text: string, url: string): string {
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

  private async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    try {
      await this.mailerService.sendMail({
        ...options,
        from: `"Lockie Visuals" <${this.configService.get('EMAIL_USER')}>`,
      });
      this.logger.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendBookingNotification(booking: Booking): Promise<void> {
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

  async sendBookingConfirmedNotification(booking: Booking): Promise<void> {
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

  async sendServiceDeliveredNotification(booking: Booking): Promise<void> {
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

  async sendBookingUpdateNotification(booking: Booking): Promise<void> {
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

  async sendBookingCancellationNotification(booking: Booking): Promise<void> {
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
          <p>If you didn't request this cancellation or have any questions, please contact us immediately.</p>
          <p>We hope to serve you again in the future.</p>
        </div>
      `,
    });
  }
}