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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const user_entity_1 = require("../entities/user.entity");
const email_service_1 = require("../email.service");
const date_fns_1 = require("date-fns");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, emailService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async signup(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const verificationToken = (0, uuid_1.v4)();
        const verificationTokenExpiry = (0, date_fns_1.addHours)(new Date(), 24);
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiry,
            isEmailVerified: false,
        });
        try {
            await this.userRepository.save(user);
            await this.emailService.sendVerificationEmail(user.email, verificationToken);
            return {
                message: 'Registration successful. Please check your email to verify your account.'
            };
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.UnauthorizedException('Email already exists');
            }
            throw error;
        }
    }
    async login(loginDto) {
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email }
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isEmailVerified) {
            throw new common_1.UnauthorizedException('Please verify your email before logging in');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async verifyEmail(token) {
        const user = await this.userRepository.findOne({
            where: { verificationToken: token }
        });
        if (!user) {
            throw new common_1.NotFoundException('Invalid verification token');
        }
        if (new Date() > user.verificationTokenExpiry) {
            throw new common_1.BadRequestException('Verification token has expired');
        }
        user.isEmailVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiry = null;
        await this.userRepository.save(user);
        return {
            message: 'Email verified successfully',
        };
    }
    async resendVerificationEmail(email) {
        const user = await this.userRepository.findOne({
            where: { email }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException('Email is already verified');
        }
        const verificationToken = (0, uuid_1.v4)();
        const verificationTokenExpiry = (0, date_fns_1.addHours)(new Date(), 24);
        user.verificationToken = verificationToken;
        user.verificationTokenExpiry = verificationTokenExpiry;
        await this.userRepository.save(user);
        await this.emailService.sendVerificationEmail(user.email, verificationToken);
        return {
            message: 'Verification email has been resent',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
