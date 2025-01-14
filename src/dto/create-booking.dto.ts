import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  serviceName: string; // The name of the service the user wants to book
}
