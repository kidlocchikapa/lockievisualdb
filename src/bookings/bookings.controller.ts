import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { BookingService } from './bookings.service';
import { CreateBookingDto } from '../dto/create-booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    const user = req.user; // Extract the logged-in user's info from the token
    return this.bookingService.createBooking(createBookingDto.serviceName, user.userId);
  }
}
