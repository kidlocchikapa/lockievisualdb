import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { BookingService } from './bookings.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { ChangeBookingStatusDto } from '../dto/change-booking-status.dto';
import { CustomRequest } from '../interfaces/request.interface';
import { BookingStatus } from '../entities/bookings.entity';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: CustomRequest
  ) {
    return this.bookingService.createBooking(createBookingDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserBookings(@Req() req: CustomRequest) {
    return this.bookingService.getUserBookings(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getBookingById(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.getBookingById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() req: CustomRequest
  ) {
    return this.bookingService.updateBooking(id, updateBookingDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async changeBookingStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeBookingStatusDto
  ) {
    return this.bookingService.changeStatus(id, changeStatusDto.status);
  }

  @Patch(':id/confirm')
  async confirmBooking(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.changeStatus(id, BookingStatus.CONFIRMED);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancelBooking(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: CustomRequest
  ) {
    return this.bookingService.cancelBooking(id, req.user);
  }
}