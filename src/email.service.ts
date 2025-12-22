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
      <div style="background-color: #ffffff; padding: 40px 20px; text-align: center;">
        <img src="cid:lockie_logo" alt="Lockie Visuals" style="width: 180px; height: auto; display: block; margin: 0 auto;" />
      </div>
      <div style="height: 4px; background: linear-gradient(90deg, #f57c00 0%, #ffb74d 100%);"></div>
    `;
  }

  private getEmailFooter(): string {
    return `
      <div style="background-color: #f8f9fa; padding: 40px 20px; text-align: center; border-top: 1px solid #edf2f7;">
        <div style="margin-bottom: 20px;">
          <a href="${this.configService.get('APP_URL')}" style="color: #f57c00; text-decoration: none; font-weight: bold; margin: 0 10px;">Website</a>
          <span style="color: #cbd5e0;">|</span>
          <a href="#" style="color: #f57c00; text-decoration: none; font-weight: bold; margin: 0 10px;">Facebook</a>
          <span style="color: #cbd5e0;">|</span>
          <a href="#" style="color: #f57c00; text-decoration: none; font-weight: bold; margin: 0 10px;">Instagram</a>
        </div>
        <p style="color: #718096; font-size: 14px; margin-bottom: 8px;">&copy; ${new Date().getFullYear()} Lockie Visuals. All rights reserved.</p>
        <p style="color: #a0aec0; font-size: 12px;">Blantyre, Malawi • Premium Visual Content Creation</p>
        <p style="color: #a0aec0; font-size: 11px; margin-top: 20px;">You are receiving this email because of your activity on Lockie Visuals.</p>
      </div>
    `;
  }

  private getActionButton(text: string, url: string, color: string = '#f57c00'): string {
    return `
      <div style="text-align: center; margin: 35px 0;">
        <a href="${url}" 
           style="background-color: ${color};
                  color: white;
                  padding: 14px 32px;
                  text-align: center;
                  text-decoration: none;
                  display: inline-block;
                  border-radius: 8px;
                  font-weight: bold;
                  font-size: 16px;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                  transition: all 0.2s ease;">
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
            cid: 'lockie_logo', // Unique CID to help prevent attachment showing
            contentDisposition: 'inline',
          },
        ],
      });
      this.logger.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
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
      subject: 'New Booking Request - Action Required',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 0; color: #1a202c; line-height: 1.6; max-width: 600px; margin: 0 auto; background-color: #f7fafc;">
          ${this.getEmailHeader()}
          <div style="padding: 40px; background-color: #ffffff;">
            <h2 style="color: #2d3748; margin-top: 0; font-size: 24px; font-weight: 800; text-align: center;">New Booking Request</h2>
            <p style="text-align: center; color: #4a5568; margin-bottom: 30px;">A new service request has been submitted and requires your attention.</p>
            
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 12px; border: 1px solid #edf2f7; margin-bottom: 30px;">
              <div style="margin-bottom: 12px;"><strong style="color: #718096; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Service Type</strong><div style="font-size: 16px; font-weight: bold; color: #2d3748;">${booking.serviceName}</div></div>
              <div style="margin-bottom: 12px;"><strong style="color: #718096; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Customer</strong><div style="font-size: 16px; color: #2d3748;">${booking.userEmail}</div></div>
              <div style="margin-bottom: 12px;"><strong style="color: #718096; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Reference</strong><div style="font-size: 16px; color: #2d3748;">#LV-${booking.id}</div></div>
              <div><strong style="color: #718096; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Total Amount</strong><div style="font-size: 18px; font-weight: bold; color: #f57c00;">MWK ${Number(booking.totalAmount).toLocaleString()}</div></div>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
              <p style="font-weight: 700; color: #2d3748; margin-bottom: 20px;">Review this booking:</p>
              <div style="display: table; margin: 0 auto;">
                <div style="display: table-cell;">
                    <a href="${confirmUrl}" style="background-color: #48bb78; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0 5px; display: inline-block;">Confirm</a>
                </div>
                <div style="display: table-cell;">
                    <a href="${rejectUrl}" style="background-color: #f56565; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0 5px; display: inline-block;">Reject</a>
                </div>
              </div>
            </div>
          </div>
          ${this.getEmailFooter()}
        </div>
      `,
    });
  }

  async sendBookingConfirmedNotification(booking: Booking): Promise<void> {
    const appUrl = this.configService.get('APP_URL');
    const viewBookingUrl = `${appUrl}/dashboard`;

    await this.sendEmail({
      to: booking.userEmail,
      subject: 'Great news! Your booking is confirmed',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1a202c; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #edf2f7;">
          ${this.getEmailHeader()}
          <div style="padding: 40px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background-color: #f0fff4; width: 64px; height: 64px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="color: #38a169; font-size: 32px;">✓</span>
              </div>
              <h2 style="color: #2d3748; margin: 0; font-size: 24px; font-weight: 800;">Booking Confirmed</h2>
            </div>
            
            <p style="font-size: 16px; color: #4a5568;">Hi there,</p>
            <p style="font-size: 16px; color: #4a5568;">We're excited to confirm that your booking for <strong>${booking.serviceName}</strong> has been successfully accepted! We are ready to bring your vision to life.</p>
            
            <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin: 30px 0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #718096; text-transform: uppercase;">Booking Details</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #4a5568;">Service:</td>
                  <td style="padding: 8px 0; color: #2d3748; font-weight: bold; text-align: right;">${booking.serviceName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #4a5568;">Order ID:</td>
                  <td style="padding: 8px 0; color: #2d3748; text-align: right;">#LV-${booking.id}</td>
                </tr>
              </table>
            </div>
            
            <p style="font-size: 15px; color: #718096; text-align: center;">You can track your booking status anytime in your dashboard.</p>
            
            ${this.getActionButton('View Booking', viewBookingUrl)}
            
            <p style="font-size: 16px; color: #4a5568; text-align: center; margin-top: 30px;">Thank you for choosing <strong>Lockie Visuals</strong>.</p>
          </div>
          ${this.getEmailFooter()}
        </div>
      `,
    });
  }

  async sendServiceDeliveredNotification(booking: Booking): Promise<void> {
    const appUrl = this.configService.get('APP_URL');
    const dashboardUrl = `${appUrl}/dashboard`;

    await this.sendEmail({
      to: booking.userEmail,
      subject: 'Your project is ready! 🚀',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1a202c; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #edf2f7;">
          ${this.getEmailHeader()}
          <div style="padding: 40px; background-color: #ffffff;">
            <h2 style="color: #2d3748; margin-top: 0; font-size: 26px; font-weight: 800; text-align: center;">Delivery Complete!</h2>
            <p style="font-size: 17px; color: #4a5568; text-align: center;">We've finished working on your <strong>${booking.serviceName}</strong> project.</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <img src="https://img.icons8.com/clouds/200/checked-2.png" alt="Delivered" style="width: 120px; height: auto;" />
            </div>
            
            <p style="font-size: 16px; color: #4a5568;">Your files and final details are now available for access. We take great pride in our work and hope it exceeds your expectations.</p>
            
            <div style="background-color: #ebf8ff; padding: 20px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #3182ce;">
               <p style="margin: 0; color: #2c5282; font-weight: bold;">Next Step:</p>
               <p style="margin: 5px 0 0 0; color: #2b6cb0; font-size: 14px;">Please review the delivered work and settle any remaining balance if applicable.</p>
            </div>
            
            ${this.getActionButton('Access Delivered Files', dashboardUrl)}
            
            <p style="text-align: center; color: #718096; font-size: 15px;">It was a pleasure working with you!</p>
          </div>
          ${this.getEmailFooter()}
        </div>
      `,
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const appUrl = this.configService.get('APP_URL');
    const verificationUrl = `${appUrl}/auth/verify-email?token=${token}`;
    await this.sendEmail({
      to: email,
      subject: 'Verify your email address - Lockie Visuals',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1a202c; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #edf2f7;">
          ${this.getEmailHeader()}
          <div style="padding: 40px; background-color: #ffffff;">
            <h2 style="color: #2d3748; margin-top: 0; font-size: 24px; font-weight: 800; text-align: center;">Welcome to the family!</h2>
            <p style="font-size: 16px; color: #4a5568; text-align: center;">We're thrilled to have you join <strong>Lockie Visuals</strong>. One last step remains before you can start booking premium visual services.</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <img src="https://img.icons8.com/clouds/200/mail.png" alt="Verify" style="width: 100px; height: auto;" />
            </div>
            
            ${this.getActionButton('Verify Email Address', verificationUrl)}
            
            <p style="text-align: center; color: #718096; font-size: 14px; margin-top: 30px;">
              Button not working? Copy and paste this link:<br>
              <a href="${verificationUrl}" style="color: #f57c00;">${verificationUrl}</a>
            </p>
            <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 20px;">
              This link will expire in 24 hours. If you didn't create an account, please ignore this email.
            </p>
          </div>
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
      subject: 'Reset your password - Lockie Visuals',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1a202c; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #edf2f7;">
          ${this.getEmailHeader()}
          <div style="padding: 40px; background-color: #ffffff;">
            <h2 style="color: #2d3748; margin-top: 0; font-size: 24px; font-weight: 800; text-align: center;">Password Reset</h2>
            <p style="font-size: 16px; color: #4a5568; text-align: center;">We received a request to reset your password. If this was you, click the button below to secure your account.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <img src="https://img.icons8.com/clouds/200/lock-landscape.png" alt="Reset" style="width: 100px; height: auto;" />
            </div>
            
            ${this.getActionButton('Reset Password', resetUrl)}
            
            <p style="text-align: center; color: #718096; font-size: 14px; margin-top: 30px;">
              If you did not request this, you can safely ignore this email. Your password will remain unchanged.
            </p>
            <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 20px;">
              This link will expire in 1 hour for security reasons.
            </p>
          </div>
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
      subject: 'Your feedback has a new update! ✨',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1a202c; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #edf2f7;">
          ${this.getEmailHeader()}
          <div style="padding: 40px; background-color: #ffffff;">
            <h2 style="color: #2d3748; margin-top: 0; font-size: 24px; font-weight: 800; text-align: center;">Feedback Update</h2>
            <p style="font-size: 16px; color: #4a5568; text-align: center;">One of our team members has responded to your recent feedback.</p>
            
            <div style="margin: 35px 0;">
              <div style="background-color: #f7fafc; padding: 20px; border-radius: 12px; border: 1px solid #edf2f7; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #718096; text-transform: uppercase;">Your Message</p>
                <p style="margin: 0; font-style: italic; color: #4a5568;">"${content}"</p>
              </div>
              
              <div style="background-color: #fffaf0; padding: 20px; border-radius: 12px; border: 1px solid #feebc8;">
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #dd6b20; text-transform: uppercase;">Our Response</p>
                <p style="margin: 0; color: #2d3748; font-weight: 600;">${response}</p>
              </div>
            </div>
            
            <p style="text-align: center; color: #718096; font-size: 15px;">We value your input and are always looking for ways to improve.</p>
          </div>
          ${this.getEmailFooter()}
        </div>
      `,
    });
  }
}