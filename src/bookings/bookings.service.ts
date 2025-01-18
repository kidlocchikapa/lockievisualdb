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

  async updateBooking(id: number, updateBookingDto: UpdateBookingDto, user?: User): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }

    // If user is provided and not admin, check if they own the booking
    if (user && user.role !== 'admin' && booking.user.id !== user.id) {
      throw new ForbiddenException('You are not authorized to update this booking');
    }

    // Prevent updating if booking is in a final state
    if ([BookingStatus.CONFIRMED, BookingStatus.CANCELLED, BookingStatus.DELIVERED].includes(booking.status)) {
      throw new ForbiddenException(`Cannot update ${booking.status.toLowerCase()} booking`);
    }

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

  async changeStatus(id: number, newStatus: BookingStatus, user?: User): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }

    // Status transition validations
    if (booking.status === BookingStatus.CANCELLED) {
      throw new ForbiddenException('Cannot change status of cancelled booking');
    }

    if (booking.status === BookingStatus.DELIVERED) {
      throw new ForbiddenException('Cannot change status of delivered booking');
    }

    if (booking.status === BookingStatus.CONFIRMED && newStatus === BookingStatus.PENDING) {
      throw new ForbiddenException('Cannot change confirmed booking back to pending');
    }

    // Only allow specific status transitions
    const allowedTransitions = {
      [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
      [BookingStatus.CONFIRMED]: [BookingStatus.DELIVERED, BookingStatus.CANCELLED],
      [BookingStatus.DELIVERED]: [],
      [BookingStatus.CANCELLED]: [],
    };

    if (!allowedTransitions[booking.status].includes(newStatus)) {
      throw new ForbiddenException(`Cannot change status from ${booking.status} to ${newStatus}`);
    }

    booking.status = newStatus;
    const savedBooking = await this.bookingRepository.save(booking);

    // Send appropriate notifications based on status change
    switch (newStatus) {
      case BookingStatus.CONFIRMED:
        await this.emailService.sendBookingConfirmedNotification(savedBooking);
        break;
      case BookingStatus.DELIVERED:
        await this.emailService.sendServiceDeliveredNotification(savedBooking);
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

  async markAsDelivered(id: number): Promise<Booking> {
    return this.changeStatus(id, BookingStatus.DELIVERED);
  }

  async cancelBooking(id: number, user?: User): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }

    // Only allow cancellation if it's the booking owner or an admin
    if (user && user.role !== 'admin' && booking.user.id !== user.id) {
      throw new ForbiddenException('You are not authorized to cancel this booking');
    }

    return this.changeStatus(id, BookingStatus.CANCELLED, user);
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

  async getAllBookings(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }
}
