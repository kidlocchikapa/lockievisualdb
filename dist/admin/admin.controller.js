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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt.auth-guard");
const roles_guards_1 = require("../auth/roles.guards");
const decolators_1 = require("../decolators");
const bookings_service_1 = require("../bookings/bookings.service");
const feedback_service_1 = require("../feedback/feedback.service");
const contact_service_1 = require("../contact/contact.service");
const email_service_1 = require("../email.service");
let AdminController = class AdminController {
    constructor(bookingService, feedbackService, contactService, emailService) {
        this.bookingService = bookingService;
        this.feedbackService = feedbackService;
        this.contactService = contactService;
        this.emailService = emailService;
    }
    async getAllBookings() {
        try {
            const bookings = await this.bookingService.getAllBookings();
            return bookings;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch bookings', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllContacts() {
        try {
            return await this.contactService.findAll();
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch contacts', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllFeedback() {
        try {
            return await this.feedbackService.findAll();
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch feedback', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async respondToFeedback(id, response) {
        try {
            const feedback = await this.feedbackService.respond(id, response);
            if (feedback.user && feedback.user.email) {
                await this.emailService.sendFeedbackResponseEmail(feedback.user.email, feedback.content, response);
            }
            return feedback;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to respond to feedback', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUnreadCounts() {
        try {
            const bookings = await this.bookingService.getUnreadCounts();
            const feedback = await this.feedbackService.getUnreadCount();
            const contacts = await this.contactService.getUnreadCount();
            return { bookings, feedback, contacts, total: bookings + feedback + contacts };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch unread stats', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async confirmBooking(id) {
        try {
            const confirmedBooking = await this.bookingService.confirmBooking(id);
            return confirmedBooking;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to confirm booking', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async rejectBooking(id) {
        try {
            const rejectedBooking = await this.bookingService.cancelBooking(id);
            return rejectedBooking;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to reject booking', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async markBookingDelivered(id) {
        try {
            const deliveredBooking = await this.bookingService.markAsDelivered(id);
            return deliveredBooking;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to mark booking as delivered', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getBookingDetails(id) {
        try {
            const booking = await this.bookingService.getBookingById(id);
            return booking;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to fetch booking details', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async markBookingRead(id) {
        return await this.bookingService.markAsRead(id);
    }
    async markContactRead(id) {
        return await this.contactService.markAsRead(id);
    }
    async markFeedbackRead(id) {
        return await this.feedbackService.markAsRead(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('bookings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllBookings", null);
__decorate([
    (0, common_1.Get)('contacts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllContacts", null);
__decorate([
    (0, common_1.Get)('feedback'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllFeedback", null);
__decorate([
    (0, common_1.Post)('feedback/:id/respond'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('response')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "respondToFeedback", null);
__decorate([
    (0, common_1.Get)('stats/unread'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUnreadCounts", null);
__decorate([
    (0, common_1.Post)('bookings/:id/confirm'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "confirmBooking", null);
__decorate([
    (0, common_1.Post)('bookings/:id/reject'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectBooking", null);
__decorate([
    (0, common_1.Post)('bookings/:id/deliver'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "markBookingDelivered", null);
__decorate([
    (0, common_1.Get)('bookings/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBookingDetails", null);
__decorate([
    (0, common_1.Post)('bookings/:id/read'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "markBookingRead", null);
__decorate([
    (0, common_1.Post)('contacts/:id/read'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "markContactRead", null);
__decorate([
    (0, common_1.Post)('feedback/:id/read'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "markFeedbackRead", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guards_1.RolesGuard),
    (0, decolators_1.Roles)(decolators_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [bookings_service_1.BookingService,
        feedback_service_1.FeedbackService,
        contact_service_1.ContactService,
        email_service_1.EmailService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map