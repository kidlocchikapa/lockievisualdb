// src/bookings/booking.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './bookings.controller';
import { BookingService } from './bookings.service';
import { EmailService } from '../email.service';
import { Booking } from '../entities/bookings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  controllers: [BookingController],
  providers: [BookingService, EmailService],
  exports: [BookingService],
})
export class BookingModule {}