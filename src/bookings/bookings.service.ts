import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entities/bookings.entity';
import { EmailService } from '../email.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private emailService: EmailService,
  ) {}

  async createBooking(bookingData: CreateBookingDto, user: User): Promise<Booking> {
    const booking = this.bookingRepository.create({
      serviceName: bookingData.serviceName,
      userEmail: user.email,
      status: BookingStatus.PENDING,
      user: user,
      additionalDetails: bookingData.additionalDetails || {}
    });

    const savedBooking = await this.bookingRepository.save(booking);
    await this.emailService.sendBookingNotification(savedBooking);

    return savedBooking;
  }

  async updateBooking(id: number, updateBookingDto: UpdateBookingDto, user: User): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['user']
    });

    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }

    // Prevent updating if booking is already confirmed or cancelled
    if (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.CANCELLED) {
      throw new ForbiddenException(`Cannot update ${booking.status.toLowerCase()} booking`);
    }

    // Update allowed fields
    if (updateBookingDto.serviceName) {
      booking.serviceName = updateBookingDto.serviceName;
    }
    
    if (updateBookingDto.additionalDetails) {
      booking.additionalDetails = {
        ...booking.additionalDetails,
        ...updateBookingDto.additionalDetails
      };
    }

    const savedBooking = await this.bookingRepository.save(booking);
    await this.emailService.sendBookingUpdateNotification(savedBooking);

    return savedBooking;
  }

  async changeStatus(id: number, newStatus: BookingStatus): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }

    // Prevent status change if booking is already cancelled
    if (booking.status === BookingStatus.CANCELLED) {
      throw new ForbiddenException('Cannot change status of cancelled booking');
    }

    // Prevent changing from CONFIRMED back to PENDING
    if (booking.status === BookingStatus.CONFIRMED && newStatus === BookingStatus.PENDING) {
      throw new ForbiddenException('Cannot change confirmed booking back to pending');
    }

    booking.status = newStatus;
    const savedBooking = await this.bookingRepository.save(booking);

    // Send appropriate notifications based on status change
    switch (newStatus) {
      case BookingStatus.CONFIRMED:
        await this.emailService.sendBookingConfirmedNotification(savedBooking);
        break;
      case BookingStatus.CANCELLED:
        await this.emailService.sendBookingCancellationNotification(savedBooking);
        break;
    }

    return savedBooking;
  }

  async confirmBooking(id: number): Promise<Booking> {
    return this.changeStatus(id, BookingStatus.CONFIRMED);
  }

  async cancelBooking(id: number, user: User): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }

    // Only allow cancellation if it's the booking owner or an admin
    if (booking.user.id !== user.id) {
      throw new ForbiddenException('You are not authorized to cancel this booking');
    }

    return this.changeStatus(id, BookingStatus.CANCELLED);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }

  async getBookingById(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }

    return booking;
  }
}