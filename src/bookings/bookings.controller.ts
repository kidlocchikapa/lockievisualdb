import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { BookingService } from './bookings.service';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createBooking(@Body() body, @Req() req) {
    const user = req.user; // Extract logged-in user's details from the request
    return this.bookingService.createBooking({
      serviceName: body.serviceName,
      userEmail: user.email, // Use the user's email from the token
    });
  }
}
