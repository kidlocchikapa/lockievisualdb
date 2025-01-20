import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { BookingModule } from '../bookings/bookings.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email.module';
import { Booking } from '../entities/bookings.entity';
import { User } from '../entities/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule for email configuration access
    TypeOrmModule.forFeature([Booking, User]),
    BookingModule,
    AuthModule,
    EmailModule, // This will bring in the configured EmailService
  ],
  controllers: [AdminController],
})
export class AdminModule {}