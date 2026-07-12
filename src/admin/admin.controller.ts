import { Controller, Post, Get, Param, UseGuards, HttpException, HttpStatus, ParseIntPipe, Body, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { RolesGuard } from '../auth/roles.guards'
import { Roles, UserRole } from '../decolators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { BookingService } from '../bookings/bookings.service';
import { BookingStatus } from '../entities/bookings.entity';
import { FeedbackService } from '../feedback/feedback.service';
import { ContactService } from '../contact/contact.service';
import { EmailService } from '../email.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly feedbackService: FeedbackService,
    private readonly contactService: ContactService,
    private readonly emailService: EmailService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  @Get('bookings')
  async getAllBookings() {
    try {
      const bookings = await this.bookingService.getAllBookings();
      return bookings;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch bookings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('contacts')
  async getAllContacts() {
    try {
      return await this.contactService.findAll();
    } catch (error) {
      throw new HttpException('Failed to fetch contacts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('feedback')
  async getAllFeedback() {
    try {
      return await this.feedbackService.findAll();
    } catch (error) {
      throw new HttpException('Failed to fetch feedback', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('feedback/:id/respond')
  async respondToFeedback(
    @Param('id', ParseIntPipe) id: number,
    @Body('response') response: string
  ) {
    try {
      const feedback = await this.feedbackService.respond(id, response);
      if (feedback.user && feedback.user.email) {
        await this.emailService.sendFeedbackResponseEmail(
          feedback.user.email,
          feedback.content,
          response
        );
      }
      return feedback;
    } catch (error) {
      throw new HttpException(error.message || 'Failed to respond to feedback', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('stats/unread')
  async getUnreadCounts() {
    try {
      const bookings = await this.bookingService.getUnreadCounts();
      const feedback = await this.feedbackService.getUnreadCount();
      const contacts = await this.contactService.getUnreadCount();
      return { bookings, feedback, contacts, total: bookings + feedback + contacts };
    } catch (error) {
      throw new HttpException('Failed to fetch unread stats', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('bookings/:id/confirm')
  async confirmBooking(@Param('id', ParseIntPipe) id: number) {
    try {
      const confirmedBooking = await this.bookingService.confirmBooking(id);
      return confirmedBooking;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to confirm booking',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('bookings/:id/reject')
  async rejectBooking(@Param('id', ParseIntPipe) id: number) {
    try {
      const rejectedBooking = await this.bookingService.cancelBooking(id);
      return rejectedBooking;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to reject booking',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('bookings/:id/deliver')
  async markBookingDelivered(@Param('id', ParseIntPipe) id: number) {
    try {
      const deliveredBooking = await this.bookingService.markAsDelivered(id);
      return deliveredBooking;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to mark booking as delivered',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('bookings/:id')
  async getBookingDetails(@Param('id', ParseIntPipe) id: number) {
    try {
      const booking = await this.bookingService.getBookingById(id);
      return booking;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to fetch booking details',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('bookings/:id/read')
  async markBookingRead(@Param('id', ParseIntPipe) id: number) {
    return await this.bookingService.markAsRead(id);
  }

  @Post('contacts/:id/read')
  async markContactRead(@Param('id', ParseIntPipe) id: number) {
    return await this.contactService.markAsRead(id);
  }

  @Post('feedback/:id/read')
  async markFeedbackRead(@Param('id', ParseIntPipe) id: number) {
    return await this.feedbackService.markAsRead(id);
  }

  @Get('users')
  async getAllUsers() {
    try {
      const users = await this.userRepository.find({
        select: ['id', 'fullName', 'email', 'role', 'isEmailVerified', 'createdAt'],
        order: { createdAt: 'DESC' },
      });
      return users;
    } catch (error) {
      throw new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('users')
  async createAdmin(@Body() body: { email: string; fullName: string; password: string }) {
    try {
      const existing = await this.userRepository.findOne({ where: { email: body.email } });
      if (existing) {
        existing.role = 'admin';
        await this.userRepository.save(existing);
        return { message: 'User promoted to admin', user: { id: existing.id, email: existing.email, role: existing.role } };
      }
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const user = this.userRepository.create({
        fullName: body.fullName,
        email: body.email,
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
      });
      await this.userRepository.save(user);
      return { message: 'Admin created successfully', user: { id: user.id, email: user.email, role: user.role } };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to create admin', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    try {
      if (id === 0) {
        throw new HttpException('Cannot delete master admin', HttpStatus.BAD_REQUEST);
      }
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      await this.userRepository.remove(user);
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}