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
    await this.sendEmail({
      to: 'kidloc24chikapa@gmail.com',
      subject: 'New Booking Request',
      html: `
        <h2>New Booking Request</h2>
        <p>Service: ${booking.serviceName}</p>
        <p>User: ${booking.userEmail}</p>
        <p>Booking ID: ${booking.id}</p>
        <p>Status: ${booking.status}</p>
        <p>Created At: ${booking.createdAt}</p>
      `,
    });
  }

  async sendBookingConfirmedNotification(booking: Booking): Promise<void> {
    await this.sendEmail({
      to: booking.userEmail,
      subject: 'Booking Confirmed',
      html: `
        <h2>Booking Confirmed</h2>
        <p>Dear Customer,</p>
        <p>Your booking for ${booking.serviceName} has been confirmed.</p>
        <p>Booking Details:</p>
        <ul>
          <li>Booking ID: ${booking.id}</li>
          <li>Service: ${booking.serviceName}</li>
          <li>Status: Confirmed</li>
        </ul>
        <p>Thank you for choosing Lockie Visuals!</p>
      `,
    });
  }

  async sendBookingUpdateNotification(booking: Booking): Promise<void> {
    await this.sendEmail({
      to: booking.userEmail,
      subject: 'Booking Updated',
      html: `
        <h2>Booking Updated</h2>
        <p>Dear Customer,</p>
        <p>Your booking for ${booking.serviceName} has been updated.</p>
        <p>Updated Details:</p>
        <ul>
          <li>Booking ID: ${booking.id}</li>
          <li>Service: ${booking.serviceName}</li>
          <li>Current Status: ${booking.status}</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact us.</p>
      `,
    });
  }

  async sendBookingCancellationNotification(booking: Booking): Promise<void> {
    await this.sendEmail({
      to: booking.userEmail,
      subject: 'Booking Cancelled',
      html: `
        <h2>Booking Cancelled</h2>
        <p>Dear Customer,</p>
        <p>Your booking for ${booking.serviceName} has been cancelled.</p>
        <p>Booking Details:</p>
        <ul>
          <li>Booking ID: ${booking.id}</li>
          <li>Service: ${booking.serviceName}</li>
        </ul>
        <p>If this was not intended, please contact us immediately.</p>
      `,
    });
  }
}