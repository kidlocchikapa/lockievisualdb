// admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { BookingModule } from '../bookings/bookings.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    BookingModule,
    AuthModule
  ],
  controllers: [AdminController],
})
export class AdminModule {}