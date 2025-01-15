// src/dto/update-booking.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../entities/bookings.entity';

export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsString()
  @IsOptional()
  serviceName?: string;

  @IsOptional()
  additionalDetails?: Record<string, any>;
}