// src/bookings/booking.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './bookings.controller';
import { BookingService } from './bookings.service';
import { EmailService } from '../email.service';
import { Booking } from '../entities/bookings.entity';
import { User } from '../entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Booking, User])],
  controllers: [BookingController],
  providers: [BookingService, EmailService],
  exports: [BookingService],
})
export class BookingModule { }