"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bookings_entity_1 = require("../entities/bookings.entity");
const email_service_1 = require("../email.service");
let BookingService = class BookingService {
    constructor(bookingRepository, emailService) {
        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
    }
    async createBooking(bookingData, user) {
        const booking = this.bookingRepository.create({
            serviceName: bookingData.serviceName,
            userEmail: user.email,
            status: bookings_entity_1.BookingStatus.PENDING,
            user: user,
            additionalDetails: bookingData.additionalDetails || {}
        });
        const savedBooking = await this.bookingRepository.save(booking);
        await this.emailService.sendBookingNotification(savedBooking);
        return savedBooking;
    }
    async updateBooking(id, updateBookingDto, user) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: ['user']
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking #${id} not found`);
        }
        if (user && user.role !== 'admin' && booking.user.id !== user.id) {
            throw new common_1.ForbiddenException('You are not authorized to update this booking');
        }
        if ([bookings_entity_1.BookingStatus.CONFIRMED, bookings_entity_1.BookingStatus.CANCELLED, bookings_entity_1.BookingStatus.DELIVERED].includes(booking.status)) {
            throw new common_1.ForbiddenException(`Cannot update ${booking.status.toLowerCase()} booking`);
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
    async changeStatus(id, newStatus, user) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: ['user']
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking #${id} not found`);
        }
        if (booking.status === bookings_entity_1.BookingStatus.CANCELLED) {
            throw new common_1.ForbiddenException('Cannot change status of cancelled booking');
        }
        if (booking.status === bookings_entity_1.BookingStatus.DELIVERED) {
            throw new common_1.ForbiddenException('Cannot change status of delivered booking');
        }
        if (booking.status === bookings_entity_1.BookingStatus.CONFIRMED && newStatus === bookings_entity_1.BookingStatus.PENDING) {
            throw new common_1.ForbiddenException('Cannot change confirmed booking back to pending');
        }
        const allowedTransitions = {
            [bookings_entity_1.BookingStatus.PENDING]: [bookings_entity_1.BookingStatus.CONFIRMED, bookings_entity_1.BookingStatus.CANCELLED],
            [bookings_entity_1.BookingStatus.CONFIRMED]: [bookings_entity_1.BookingStatus.DELIVERED, bookings_entity_1.BookingStatus.CANCELLED],
            [bookings_entity_1.BookingStatus.DELIVERED]: [],
            [bookings_entity_1.BookingStatus.CANCELLED]: [],
        };
        if (!allowedTransitions[booking.status].includes(newStatus)) {
            throw new common_1.ForbiddenException(`Cannot change status from ${booking.status} to ${newStatus}`);
        }
        booking.status = newStatus;
        const savedBooking = await this.bookingRepository.save(booking);
        switch (newStatus) {
            case bookings_entity_1.BookingStatus.CONFIRMED:
                await this.emailService.sendBookingConfirmedNotification(savedBooking);
                break;
            case bookings_entity_1.BookingStatus.DELIVERED:
                await this.emailService.sendServiceDeliveredNotification(savedBooking);
                break;
            case bookings_entity_1.BookingStatus.CANCELLED:
                await this.emailService.sendBookingCancellationNotification(savedBooking);
                break;
        }
        return savedBooking;
    }
    async confirmBooking(id) {
        return this.changeStatus(id, bookings_entity_1.BookingStatus.CONFIRMED);
    }
    async markAsDelivered(id) {
        return this.changeStatus(id, bookings_entity_1.BookingStatus.DELIVERED);
    }
    async cancelBooking(id, user) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: ['user']
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking #${id} not found`);
        }
        if (user && user.role !== 'admin' && booking.user.id !== user.id) {
            throw new common_1.ForbiddenException('You are not authorized to cancel this booking');
        }
        return this.changeStatus(id, bookings_entity_1.BookingStatus.CANCELLED, user);
    }
    async getUserBookings(userId) {
        return this.bookingRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });
    }
    async getBookingById(id) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: ['user']
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking #${id} not found`);
        }
        return booking;
    }
    async getAllBookings() {
        return this.bookingRepository.find({
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bookings_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        email_service_1.EmailService])
], BookingService);
