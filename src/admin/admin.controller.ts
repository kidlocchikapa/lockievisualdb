// admin/admin.controller.ts
import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { RolesGuard } from '../auth/roles.guards';
import { Roles } from '../auth/roles.decolator';
import { BookingService } from '../bookings/bookings.service';
import { UpdateBookingDto } from '../dto/update-booking.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(
    private readonly bookingService: BookingService
  ) {}

  @Get('bookings')
  async getAllBookings() {
    return await this.bookingService.getAllBookings();
  }

  @Post('bookings/:id/confirm')
  async confirmBooking(@Param('id') id: number) {
    return await this.bookingService.confirmBooking(id);
  }

  @Post('bookings/:id/reject')
  async rejectBooking(
    @Param('id') id: number,
    @Request() req
  ) {
    return await this.bookingService.cancelBooking(id, req.user);
  }

  @Post('bookings/:id/deliver')
  async markDelivered(@Param('id') id: number) {
    return await this.bookingService.markAsDelivered(id);
  }

  @Patch('bookings/:id')
  async updateBooking(
    @Param('id') id: number,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req
  ) {
    return await this.bookingService.updateBooking(id, updateBookingDto, req.user);
  }
}