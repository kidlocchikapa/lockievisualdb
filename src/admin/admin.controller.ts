import { Controller, Post, Get, Param, UseGuards, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { RolesGuard } from '../auth/roles.guards'
import { Roles } from '../auth/roles.decolator';
import { BookingService } from '../bookings/bookings.service';
import { BookingStatus } from '../entities/bookings.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(
    private readonly bookingService: BookingService,
  ) {}

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

  @Post('bookings/:id/confirm')
  async confirmBooking(@Param('id', ParseIntPipe) id: number) {
    try {
      // The existing confirmBooking method already handles email notifications
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
      // Using cancelBooking since it's the equivalent in your service
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
      // The existing markAsDelivered method already handles email notifications
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

  // Additional endpoint to get a specific booking's details
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
}