import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { BookingModule } from '../bookings/bookings.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email.module';
import { Booking } from '../entities/bookings.entity';
import { User } from '../entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { FeedbackModule } from '../feedback/feedback.module';
import { ContactModule } from '../contact/contact.module';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule for email configuration access
    TypeOrmModule.forFeature([Booking, User]),
    BookingModule,
    AuthModule,
    EmailModule,
    FeedbackModule,
    ContactModule,
  ],
  controllers: [AdminController],
})
export class AdminModule { }