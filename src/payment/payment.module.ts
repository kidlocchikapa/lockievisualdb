import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Booking } from '../entities/bookings.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Booking])],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService]
})
export class PaymentModule { }
