// src/dto/create-booking.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @IsOptional()
  additionalDetails?: Record<string, any>;
}