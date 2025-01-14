import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingService {
  async createBooking(serviceName: string, userId: number) {
    const newBooking = {
      userId,
      serviceName,
      date: new Date(),
      status: 'Pending',
    };

    // Save newBooking to the database (TypeORM, Prisma, etc.)
    // Example: await this.bookingRepository.save(newBooking);

    return {
      message: 'Booking successful',
      booking: newBooking,
    };
  }
}
