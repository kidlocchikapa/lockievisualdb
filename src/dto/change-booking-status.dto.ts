// src/dto/change-booking-status.dto.ts
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from '../entities/bookings.entity';

export class ChangeBookingStatusDto {
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus;
}