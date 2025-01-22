/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/admin.controller.ts":
/*!***************************************!*\
  !*** ./src/admin/admin.controller.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/jwt.auth-guard */ "./src/auth/jwt.auth-guard.ts");
const roles_guards_1 = __webpack_require__(/*! ../auth/roles.guards */ "./src/auth/roles.guards.ts");
const roles_decolator_1 = __webpack_require__(/*! ../auth/roles.decolator */ "./src/auth/roles.decolator.ts");
const bookings_service_1 = __webpack_require__(/*! ../bookings/bookings.service */ "./src/bookings/bookings.service.ts");
let AdminController = class AdminController {
    constructor(bookingService) {
        this.bookingService = bookingService;
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
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('bookings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllBookings", null);
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
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guards_1.RolesGuard),
    (0, roles_decolator_1.Roles)('admin'),
    __metadata("design:paramtypes", [typeof (_a = typeof bookings_service_1.BookingService !== "undefined" && bookings_service_1.BookingService) === "function" ? _a : Object])
], AdminController);


/***/ }),

/***/ "./src/admin/admin.module.ts":
/*!***********************************!*\
  !*** ./src/admin/admin.module.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const admin_controller_1 = __webpack_require__(/*! ./admin.controller */ "./src/admin/admin.controller.ts");
const bookings_module_1 = __webpack_require__(/*! ../bookings/bookings.module */ "./src/bookings/bookings.module.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./src/auth/auth.module.ts");
const email_module_1 = __webpack_require__(/*! ../email.module */ "./src/email.module.ts");
const bookings_entity_1 = __webpack_require__(/*! ../entities/bookings.entity */ "./src/entities/bookings.entity.ts");
const user_entity_1 = __webpack_require__(/*! ../entities/user.entity */ "./src/entities/user.entity.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([bookings_entity_1.Booking, user_entity_1.User]),
            bookings_module_1.BookingModule,
            auth_module_1.AuthModule,
            email_module_1.EmailModule,
        ],
        controllers: [admin_controller_1.AdminController],
    })
], AdminModule);


/***/ }),

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const mailer_1 = __webpack_require__(/*! @nestjs-modules/mailer */ "@nestjs-modules/mailer");
const handlebars_adapter_1 = __webpack_require__(/*! @nestjs-modules/mailer/dist/adapters/handlebars.adapter */ "@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const common_2 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ "./src/auth/auth.module.ts");
const feedback_module_1 = __webpack_require__(/*! ./feedback/feedback.module */ "./src/feedback/feedback.module.ts");
const bookings_module_1 = __webpack_require__(/*! ./bookings/bookings.module */ "./src/bookings/bookings.module.ts");
const admin_module_1 = __webpack_require__(/*! ./admin/admin.module */ "./src/admin/admin.module.ts");
const user_entity_1 = __webpack_require__(/*! ./entities/user.entity */ "./src/entities/user.entity.ts");
const feedback_entity_1 = __webpack_require__(/*! ./entities/feedback.entity */ "./src/entities/feedback.entity.ts");
const bookings_entity_1 = __webpack_require__(/*! ./entities/bookings.entity */ "./src/entities/bookings.entity.ts");
const contact_entity_1 = __webpack_require__(/*! ./entities/contact.entity */ "./src/entities/contact.entity.ts");
const email_service_1 = __webpack_require__(/*! ./email.service */ "./src/email.service.ts");
const contact_service_1 = __webpack_require__(/*! ./contact/contact.service */ "./src/contact/contact.service.ts");
const contact_controller_1 = __webpack_require__(/*! ./contact/contact.controller */ "./src/contact/contact.controller.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                envFilePath: ['.env', '.env.development', '.env.production'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const isProduction = configService.get('NODE_ENV') === 'production';
                    const baseConfig = {
                        type: 'postgres',
                        logging: isProduction ? ['error'] : true,
                        entities: [user_entity_1.User, feedback_entity_1.Feedback, bookings_entity_1.Booking, contact_entity_1.Contact],
                        autoLoadEntities: true,
                        synchronize: !isProduction,
                        retryAttempts: 3,
                        retryDelay: 3000,
                    };
                    if (isProduction) {
                        return {
                            ...baseConfig,
                            url: configService.get('DATABASE_URL'),
                            ssl: {
                                rejectUnauthorized: false,
                            },
                            pool: {
                                min: 2,
                                max: 20,
                                idleTimeoutMillis: 30000,
                                acquireTimeoutMillis: 20000,
                            },
                        };
                    }
                    return {
                        ...baseConfig,
                        host: configService.get('DB_HOST', 'localhost'),
                        port: configService.get('DB_PORT', 5432),
                        username: configService.get('DB_USERNAME'),
                        password: configService.get('DB_PASSWORD'),
                        database: configService.get('DB_NAME'),
                    };
                },
            }),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    transport: {
                        service: 'gmail',
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: configService.get('EMAIL_USER'),
                            pass: configService.get('EMAIL_PASSWORD'),
                        },
                        tls: {
                            rejectUnauthorized: true,
                        },
                    },
                    defaults: {
                        from: `"Lockie Visuals" <${configService.get('EMAIL_USER')}>`,
                    },
                    template: {
                        dir: process.cwd() + '/templates',
                        adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                        options: {
                            strict: false,
                        },
                    },
                    preview: configService.get('NODE_ENV') !== 'production',
                }),
            }),
            auth_module_1.AuthModule,
            feedback_module_1.FeedbackModule,
            bookings_module_1.BookingModule,
            admin_module_1.AdminModule,
            typeorm_1.TypeOrmModule.forFeature([contact_entity_1.Contact]),
        ],
        controllers: [contact_controller_1.ContactController],
        providers: [
            email_service_1.EmailService,
            contact_service_1.ContactService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: common_2.ClassSerializerInterceptor,
            },
        ],
        exports: [email_service_1.EmailService],
    })
], AppModule);


/***/ }),

/***/ "./src/auth/auth.controller.ts":
/*!*************************************!*\
  !*** ./src/auth/auth.controller.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var AuthController_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/auth/auth.service.ts");
const create_user_dto_1 = __webpack_require__(/*! ../dto/create-user.dto */ "./src/dto/create-user.dto.ts");
const login_dto_1 = __webpack_require__(/*! ../dto/login.dto */ "./src/dto/login.dto.ts");
let AuthController = AuthController_1 = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.logger = new common_1.Logger(AuthController_1.name);
    }
    async signup(createUserDto) {
        try {
            return await this.authService.signup(createUserDto);
        }
        catch (error) {
            this.logger.error(`Signup failed: ${error.message}`, error.stack);
            throw error;
        }
    }
    async login(loginDto) {
        try {
            return await this.authService.login(loginDto);
        }
        catch (error) {
            this.logger.error(`Login failed: ${error.message}`, error.stack);
            throw error;
        }
    }
    async verifyEmail(token) {
        try {
            return await this.authService.verifyEmail(token);
        }
        catch (error) {
            this.logger.error(`Email verification failed: ${error.message}`, error.stack);
            throw error;
        }
    }
    async resendVerification(email) {
        try {
            return await this.authService.resendVerificationEmail(email);
        }
        catch (error) {
            this.logger.error(`Resend verification failed: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('verify-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('resend-verification'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerification", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),

/***/ "./src/auth/auth.module.ts":
/*!*********************************!*\
  !*** ./src/auth/auth.module.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/auth/auth.controller.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/auth/auth.service.ts");
const user_entity_1 = __webpack_require__(/*! ../entities/user.entity */ "./src/entities/user.entity.ts");
const jwt_strategy_1 = __webpack_require__(/*! ./jwt.strategy */ "./src/auth/jwt.strategy.ts");
const email_module_1 = __webpack_require__(/*! ../email.module */ "./src/email.module.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: config.get('JWT_EXPIRATION', '1h')
                    },
                }),
            }),
            email_module_1.EmailModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            config_1.ConfigService,
        ],
        exports: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, passport_1.PassportModule],
    })
], AuthModule);


/***/ }),

/***/ "./src/auth/auth.service.ts":
/*!**********************************!*\
  !*** ./src/auth/auth.service.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var AuthService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const user_entity_1 = __webpack_require__(/*! ../entities/user.entity */ "./src/entities/user.entity.ts");
const email_service_1 = __webpack_require__(/*! ../email.service */ "./src/email.service.ts");
const date_fns_1 = __webpack_require__(/*! date-fns */ "date-fns");
let AuthService = AuthService_1 = class AuthService {
    constructor(userRepository, jwtService, emailService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async signup(createUserDto) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email: createUserDto.email }
            });
            if (existingUser) {
                throw new common_1.UnauthorizedException('Email already exists');
            }
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
            await this.userRepository.save(user);
            await this.emailService.sendVerificationEmail(user.email, verificationToken);
            return {
                message: 'Registration successful. Please check your email to verify your account.',
            };
        }
        catch (error) {
            this.logger.error(`Signup failed: ${error.message}`, error.stack);
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.BadRequestException('Registration failed. Please try again.');
        }
    }
    async login(loginDto) {
        try {
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
            const payload = {
                sub: user.id,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            };
            const access_token = await this.jwtService.sign(payload);
            return {
                access_token: `Bearer ${access_token}`,
                user: {
                    id: user.id,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified
                }
            };
        }
        catch (error) {
            this.logger.error(`Login failed: ${error.message}`, error.stack);
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.BadRequestException('Login failed. Please try again.');
        }
    }
    async verifyEmail(token) {
        try {
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
        catch (error) {
            this.logger.error(`Email verification failed: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Email verification failed. Please try again.');
        }
    }
    async resendVerificationEmail(email) {
        try {
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
        catch (error) {
            this.logger.error(`Resend verification email failed: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to resend verification email. Please try again.');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _c : Object])
], AuthService);


/***/ }),

/***/ "./src/auth/jwt.auth-guard.ts":
/*!************************************!*\
  !*** ./src/auth/jwt.auth-guard.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),

/***/ "./src/auth/jwt.strategy.ts":
/*!**********************************!*\
  !*** ./src/auth/jwt.strategy.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const user_entity_1 = __webpack_require__(/*! ../entities/user.entity */ "./src/entities/user.entity.ts");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, userRepository) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
        this.configService = configService;
        this.userRepository = userRepository;
    }
    async validate(payload) {
        const user = await this.userRepository.findOne({
            where: { id: payload.sub }
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], JwtStrategy);


/***/ }),

/***/ "./src/auth/roles.decolator.ts":
/*!*************************************!*\
  !*** ./src/auth/roles.decolator.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),

/***/ "./src/auth/roles.guards.ts":
/*!**********************************!*\
  !*** ./src/auth/roles.guards.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndMerge('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.includes(user.role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),

/***/ "./src/bookings/bookings.controller.ts":
/*!*********************************************!*\
  !*** ./src/bookings/bookings.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/jwt.auth-guard */ "./src/auth/jwt.auth-guard.ts");
const bookings_service_1 = __webpack_require__(/*! ./bookings.service */ "./src/bookings/bookings.service.ts");
const create_booking_dto_1 = __webpack_require__(/*! ../dto/create-booking.dto */ "./src/dto/create-booking.dto.ts");
const update_booking_dto_1 = __webpack_require__(/*! ../dto/update-booking.dto */ "./src/dto/update-booking.dto.ts");
const change_booking_status_dto_1 = __webpack_require__(/*! ../dto/change-booking-status.dto */ "./src/dto/change-booking-status.dto.ts");
const request_interface_1 = __webpack_require__(/*! ../interfaces/request.interface */ "./src/interfaces/request.interface.ts");
const bookings_entity_1 = __webpack_require__(/*! ../entities/bookings.entity */ "./src/entities/bookings.entity.ts");
const decolators_1 = __webpack_require__(/*! ../decolators */ "./src/decolators.ts");
const roles_guards_1 = __webpack_require__(/*! ../guards/roles.guards */ "./src/guards/roles.guards.ts");
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    createBooking(createBookingDto, req) {
        return this.bookingService.createBooking(createBookingDto, req.user);
    }
    getUserBookings(req) {
        return this.bookingService.getUserBookings(req.user.id);
    }
    getBookingById(id) {
        return this.bookingService.getBookingById(id);
    }
    async updateBooking(id, updateBookingDto, req) {
        return this.bookingService.updateBooking(id, updateBookingDto, req.user);
    }
    async changeBookingStatus(id, changeStatusDto, req) {
        return this.bookingService.changeStatus(id, changeStatusDto.status, req.user);
    }
    async confirmBooking(id, req) {
        return this.bookingService.changeStatus(id, bookings_entity_1.BookingStatus.CONFIRMED, req.user);
    }
    async markAsDelivered(id, req) {
        return this.bookingService.changeStatus(id, bookings_entity_1.BookingStatus.DELIVERED, req.user);
    }
    async cancelBooking(id, req) {
        return this.bookingService.cancelBooking(id, req.user);
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, decolators_1.Roles)(decolators_1.UserRole.USER),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_booking_dto_1.CreateBookingDto !== "undefined" && create_booking_dto_1.CreateBookingDto) === "function" ? _b : Object, typeof (_c = typeof request_interface_1.CustomRequest !== "undefined" && request_interface_1.CustomRequest) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "createBooking", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof request_interface_1.CustomRequest !== "undefined" && request_interface_1.CustomRequest) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getUserBookings", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getBookingById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_e = typeof update_booking_dto_1.UpdateBookingDto !== "undefined" && update_booking_dto_1.UpdateBookingDto) === "function" ? _e : Object, typeof (_f = typeof request_interface_1.CustomRequest !== "undefined" && request_interface_1.CustomRequest) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "updateBooking", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guards_1.RolesGuard),
    (0, decolators_1.Roles)(decolators_1.UserRole.ADMIN),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_g = typeof change_booking_status_dto_1.ChangeBookingStatusDto !== "undefined" && change_booking_status_dto_1.ChangeBookingStatusDto) === "function" ? _g : Object, typeof (_h = typeof request_interface_1.CustomRequest !== "undefined" && request_interface_1.CustomRequest) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "changeBookingStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guards_1.RolesGuard),
    (0, decolators_1.Roles)(decolators_1.UserRole.ADMIN),
    (0, common_1.Patch)(':id/confirm'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_j = typeof request_interface_1.CustomRequest !== "undefined" && request_interface_1.CustomRequest) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "confirmBooking", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guards_1.RolesGuard),
    (0, decolators_1.Roles)(decolators_1.UserRole.ADMIN),
    (0, common_1.Patch)(':id/deliver'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_k = typeof request_interface_1.CustomRequest !== "undefined" && request_interface_1.CustomRequest) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "markAsDelivered", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_l = typeof request_interface_1.CustomRequest !== "undefined" && request_interface_1.CustomRequest) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "cancelBooking", null);
exports.BookingController = BookingController = __decorate([
    (0, common_1.Controller)('bookings'),
    __metadata("design:paramtypes", [typeof (_a = typeof bookings_service_1.BookingService !== "undefined" && bookings_service_1.BookingService) === "function" ? _a : Object])
], BookingController);


/***/ }),

/***/ "./src/bookings/bookings.module.ts":
/*!*****************************************!*\
  !*** ./src/bookings/bookings.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const bookings_controller_1 = __webpack_require__(/*! ./bookings.controller */ "./src/bookings/bookings.controller.ts");
const bookings_service_1 = __webpack_require__(/*! ./bookings.service */ "./src/bookings/bookings.service.ts");
const email_service_1 = __webpack_require__(/*! ../email.service */ "./src/email.service.ts");
const bookings_entity_1 = __webpack_require__(/*! ../entities/bookings.entity */ "./src/entities/bookings.entity.ts");
let BookingModule = class BookingModule {
};
exports.BookingModule = BookingModule;
exports.BookingModule = BookingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([bookings_entity_1.Booking])],
        controllers: [bookings_controller_1.BookingController],
        providers: [bookings_service_1.BookingService, email_service_1.EmailService],
        exports: [bookings_service_1.BookingService],
    })
], BookingModule);


/***/ }),

/***/ "./src/bookings/bookings.service.ts":
/*!******************************************!*\
  !*** ./src/bookings/bookings.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const bookings_entity_1 = __webpack_require__(/*! ../entities/bookings.entity */ "./src/entities/bookings.entity.ts");
const email_service_1 = __webpack_require__(/*! ../email.service */ "./src/email.service.ts");
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
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _b : Object])
], BookingService);


/***/ }),

/***/ "./src/contact/contact.controller.ts":
/*!*******************************************!*\
  !*** ./src/contact/contact.controller.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContactController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const contact_service_1 = __webpack_require__(/*! ./contact.service */ "./src/contact/contact.service.ts");
const create_contact_dto_1 = __webpack_require__(/*! ../dto/create-contact.dto */ "./src/dto/create-contact.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/jwt.auth-guard */ "./src/auth/jwt.auth-guard.ts");
const decolators_1 = __webpack_require__(/*! ../decolators */ "./src/decolators.ts");
const roles_guards_1 = __webpack_require__(/*! ../guards/roles.guards */ "./src/guards/roles.guards.ts");
let ContactController = class ContactController {
    constructor(contactService) {
        this.contactService = contactService;
    }
    create(createContactDto) {
        return this.contactService.create(createContactDto);
    }
    findAll() {
        return this.contactService.findAll();
    }
};
exports.ContactController = ContactController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_contact_dto_1.CreateContactDto !== "undefined" && create_contact_dto_1.CreateContactDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guards_1.RolesGuard),
    (0, decolators_1.Roles)(decolators_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "findAll", null);
exports.ContactController = ContactController = __decorate([
    (0, common_1.Controller)('contact'),
    __metadata("design:paramtypes", [typeof (_a = typeof contact_service_1.ContactService !== "undefined" && contact_service_1.ContactService) === "function" ? _a : Object])
], ContactController);


/***/ }),

/***/ "./src/contact/contact.service.ts":
/*!****************************************!*\
  !*** ./src/contact/contact.service.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContactService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const contact_entity_1 = __webpack_require__(/*! ../entities/contact.entity */ "./src/entities/contact.entity.ts");
const email_service_1 = __webpack_require__(/*! ../email.service */ "./src/email.service.ts");
let ContactService = class ContactService {
    constructor(contactRepository, emailService) {
        this.contactRepository = contactRepository;
        this.emailService = emailService;
    }
    async create(createContactDto) {
        const contact = this.contactRepository.create(createContactDto);
        await this.contactRepository.save(contact);
        await this.emailService.sendContactNotification(contact);
        return contact;
    }
    async findAll() {
        return this.contactRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_entity_1.Contact)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _b : Object])
], ContactService);


/***/ }),

/***/ "./src/decolators.ts":
/*!***************************!*\
  !*** ./src/decolators.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = exports.UserRole = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
    UserRole["PHOTOGRAPHER"] = "photographer";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),

/***/ "./src/dto/change-booking-status.dto.ts":
/*!**********************************************!*\
  !*** ./src/dto/change-booking-status.dto.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangeBookingStatusDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const bookings_entity_1 = __webpack_require__(/*! ../entities/bookings.entity */ "./src/entities/bookings.entity.ts");
class ChangeBookingStatusDto {
}
exports.ChangeBookingStatusDto = ChangeBookingStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(bookings_entity_1.BookingStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof bookings_entity_1.BookingStatus !== "undefined" && bookings_entity_1.BookingStatus) === "function" ? _a : Object)
], ChangeBookingStatusDto.prototype, "status", void 0);


/***/ }),

/***/ "./src/dto/create-booking.dto.ts":
/*!***************************************!*\
  !*** ./src/dto/create-booking.dto.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateBookingDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class CreateBookingDto {
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "serviceName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object)
], CreateBookingDto.prototype, "additionalDetails", void 0);


/***/ }),

/***/ "./src/dto/create-contact.dto.ts":
/*!***************************************!*\
  !*** ./src/dto/create-contact.dto.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateContactDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class CreateContactDto {
}
exports.CreateContactDto = CreateContactDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "message", void 0);


/***/ }),

/***/ "./src/dto/create-feedback.dto.ts":
/*!****************************************!*\
  !*** ./src/dto/create-feedback.dto.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateFeedbackDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class CreateFeedbackDto {
}
exports.CreateFeedbackDto = CreateFeedbackDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10, {
        message: 'Feedback must be at least 10 characters long'
    }),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "content", void 0);


/***/ }),

/***/ "./src/dto/create-user.dto.ts":
/*!************************************!*\
  !*** ./src/dto/create-user.dto.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[a-zA-Z\s]*$/, {
        message: 'Full name must contain only letters and spaces'
    }),
    (0, class_validator_1.MinLength)(2, {
        message: 'Full name must be at least 2 characters long'
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\+?[\d\s-]+$/, {
        message: 'Invalid phone number format'
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);


/***/ }),

/***/ "./src/dto/login.dto.ts":
/*!******************************!*\
  !*** ./src/dto/login.dto.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),

/***/ "./src/dto/update-booking.dto.ts":
/*!***************************************!*\
  !*** ./src/dto/update-booking.dto.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateBookingDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const bookings_entity_1 = __webpack_require__(/*! ../entities/bookings.entity */ "./src/entities/bookings.entity.ts");
class UpdateBookingDto {
}
exports.UpdateBookingDto = UpdateBookingDto;
__decorate([
    (0, class_validator_1.IsEnum)(bookings_entity_1.BookingStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof bookings_entity_1.BookingStatus !== "undefined" && bookings_entity_1.BookingStatus) === "function" ? _a : Object)
], UpdateBookingDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBookingDto.prototype, "serviceName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object)
], UpdateBookingDto.prototype, "additionalDetails", void 0);


/***/ }),

/***/ "./src/email.module.ts":
/*!*****************************!*\
  !*** ./src/email.module.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mailer_1 = __webpack_require__(/*! @nestjs-modules/mailer */ "@nestjs-modules/mailer");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const email_service_1 = __webpack_require__(/*! ./email.service */ "./src/email.service.ts");
let EmailModule = class EmailModule {
};
exports.EmailModule = EmailModule;
exports.EmailModule = EmailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    transport: {
                        host: configService.get('SMTP_HOST'),
                        port: configService.get('SMTP_PORT'),
                        secure: configService.get('SMTP_SECURE', false),
                        auth: {
                            user: configService.get('EMAIL_USER'),
                            pass: configService.get('EMAIL_PASSWORD'),
                        },
                    },
                    defaults: {
                        from: `"Lockie Visuals" <${configService.get('EMAIL_USER')}>`,
                    },
                }),
            }),
        ],
        providers: [email_service_1.EmailService],
        exports: [email_service_1.EmailService],
    })
], EmailModule);


/***/ }),

/***/ "./src/email.service.ts":
/*!******************************!*\
  !*** ./src/email.service.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mailer_1 = __webpack_require__(/*! @nestjs-modules/mailer */ "@nestjs-modules/mailer");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let EmailService = EmailService_1 = class EmailService {
    constructor(mailerService, configService) {
        this.mailerService = mailerService;
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
    }
    getActionButton(text, url) {
        return `
      <a href="${url}" 
         style="background-color: #4CAF50;
                color: white;
                padding: 12px 24px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                border-radius: 4px;
                margin: 10px 0;">
        ${text}
      </a>
    `;
    }
    async sendEmail(options) {
        try {
            await this.mailerService.sendMail({
                ...options,
                from: `"Lockie Visuals" <${this.configService.get('EMAIL_USER')}>`,
            });
            this.logger.log(`Email sent successfully to ${options.to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${options.to}:`, error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
    async sendContactNotification(contact) {
        await this.sendEmail({
            to: 'kidloc24chikapa@gmail.com',
            subject: 'ContactUs Message',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Contact Form Message</h2>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p><strong>From:</strong> ${contact.name} (${contact.email})</p>
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${contact.message}</p>
            <p><strong>Sent at:</strong> ${contact.createdAt.toLocaleString()}</p>
          </div>
          <p style="color: #666; margin-top: 20px;">
            You can view all messages in your admin dashboard.
          </p>
        </div>
      `,
        });
    }
    async sendBookingNotification(booking) {
        const appUrl = this.configService.get('APP_URL');
        const confirmUrl = `${appUrl}/admin/bookings/${booking.id}/confirm`;
        const rejectUrl = `${appUrl}/admin/bookings/${booking.id}/cancel`;
        await this.sendEmail({
            to: 'kidloc24chikapa@gmail.com',
            subject: 'New Booking Request',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Booking Request</h2>
          <p>Service: ${booking.serviceName}</p>
          <p>User: ${booking.userEmail}</p>
          <p>Booking ID: ${booking.id}</p>
          <p>Status: ${booking.status}</p>
          <p>Created At: ${booking.createdAt}</p>
          
          <div style="margin-top: 20px;">
            ${this.getActionButton('Confirm Booking', confirmUrl)}
            ${this.getActionButton('Reject Booking', rejectUrl)}
          </div>
          
          <p style="margin-top: 20px; color: #666;">
            Or copy and paste these links in your browser:<br>
            Confirm: ${confirmUrl}<br>
            Reject: ${rejectUrl}
          </p>
        </div>
      `,
        });
    }
    async sendBookingConfirmedNotification(booking) {
        const appUrl = this.configService.get('APP_URL');
        const viewBookingUrl = `${appUrl}/admin/bookings/${booking.id}/view`;
        await this.sendEmail({
            to: booking.userEmail,
            subject: 'Booking Confirmed',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Booking Confirmed</h2>
          <p>Dear Customer,</p>
          <p>Your booking for ${booking.serviceName} has been confirmed.</p>
          <p>Booking Details:</p>
          <ul>
            <li>Booking ID: ${booking.id}</li>
            <li>Service: ${booking.serviceName}</li>
            <li>Status: Confirmed</li>
          </ul>
          
          ${this.getActionButton('View Booking Details', viewBookingUrl)}
          
          <p>Thank you for choosing Lockie Visuals!</p>
        </div>
      `,
        });
    }
    async sendServiceDeliveredNotification(booking) {
        const appUrl = this.configService.get('APP_URL');
        const viewBookingUrl = `${appUrl}/admin/bookings/${booking.id}/view`;
        await this.sendEmail({
            to: booking.userEmail,
            subject: 'Service Delivered - Lockie Visuals',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Service Delivered</h2>
          <p>Dear Customer,</p>
          <p>We're pleased to inform you that your service has been delivered successfully.</p>
          <p>Service Details:</p>
          <ul>
            <li>Booking ID: ${booking.id}</li>
            <li>Service: ${booking.serviceName}</li>
            <li>Status: Delivered</li>
          </ul>
          
          ${this.getActionButton('View Service Details', viewBookingUrl)}
          
          <p>Thank you for choosing Lockie Visuals. We hope you're satisfied with our service!</p>
        </div>
      `,
        });
    }
    async sendVerificationEmail(email, token) {
        const appUrl = this.configService.get('APP_URL');
        const verificationUrl = `${appUrl}/auth/verify-email/${token}`;
        await this.sendEmail({
            to: email,
            subject: 'Verify Your Email - Lockie Visuals',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Lockie Visuals!</h2>
          <p>Thank you for registering. Please verify your email address to complete your registration.</p>
          
          ${this.getActionButton('Verify Email', verificationUrl)}
          
          <p style="margin-top: 20px; color: #666;">
            If the button doesn't work, copy and paste this link in your browser:<br>
            ${verificationUrl}
          </p>
          <p style="color: #666;">
            This verification link will expire in 24 hours.
          </p>
        </div>
      `,
        });
    }
    async sendBookingUpdateNotification(booking) {
        const appUrl = this.configService.get('APP_URL');
        const viewBookingUrl = `${appUrl}/admin/bookings/${booking.id}/view`;
        await this.sendEmail({
            to: booking.userEmail,
            subject: 'Booking Updated',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Booking Update</h2>
          <p>Dear Customer,</p>
          <p>Your booking has been updated.</p>
          <p>Booking Details:</p>
          <ul>
            <li>Booking ID: ${booking.id}</li>
            <li>Service: ${booking.serviceName}</li>
            <li>Status: ${booking.status}</li>
          </ul>
          
          ${this.getActionButton('View Updated Booking', viewBookingUrl)}
          
          <p>If you have any questions about these changes, please don't hesitate to contact us.</p>
        </div>
      `,
        });
    }
    async sendBookingCancellationNotification(booking) {
        const appUrl = this.configService.get('APP_URL');
        const viewBookingUrl = `${appUrl}/admin/bookings/${booking.id}/view`;
        await this.sendEmail({
            to: booking.userEmail,
            subject: 'Booking Cancelled',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Booking Cancelled</h2>
          <p>Dear Customer,</p>
          <p>Your booking has been cancelled.</p>
          <p>Booking Details:</p>
          <ul>
            <li>Booking ID: ${booking.id}</li>
            <li>Service: ${booking.serviceName}</li>
            <li>Cancellation Date: ${new Date().toLocaleDateString()}</li>
          </ul>
          
          ${this.getActionButton('View Booking Details', viewBookingUrl)}
          
          <p>If you didn't request this cancellation or have any questions, please contact us immediately.</p>
          <p>We hope to serve you again in the future.</p>
        </div>
      `,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mailer_1.MailerService !== "undefined" && mailer_1.MailerService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], EmailService);


/***/ }),

/***/ "./src/entities/bookings.entity.ts":
/*!*****************************************!*\
  !*** ./src/entities/bookings.entity.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Booking = exports.BookingStatus = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const user_entity_1 = __webpack_require__(/*! ./user.entity */ "./src/entities/user.entity.ts");
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["CANCELLED"] = "CANCELLED";
    BookingStatus["DELIVERED"] = "DELIVERED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
let Booking = class Booking {
    toJSON() {
        const booking = { ...this };
        return booking;
    }
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "serviceName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "userEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING
    }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object)
], Booking.prototype, "additionalDetails", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Booking.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Booking.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.bookings, {
        nullable: false,
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", typeof (_d = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _d : Object)
], Booking.prototype, "user", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)()
], Booking);


/***/ }),

/***/ "./src/entities/contact.entity.ts":
/*!****************************************!*\
  !*** ./src/entities/contact.entity.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Contact = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
let Contact = class Contact {
};
exports.Contact = Contact;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Contact.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contact.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contact.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contact.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Contact.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Contact.prototype, "createdAt", void 0);
exports.Contact = Contact = __decorate([
    (0, typeorm_1.Entity)('contacts')
], Contact);


/***/ }),

/***/ "./src/entities/feedback.entity.ts":
/*!*****************************************!*\
  !*** ./src/entities/feedback.entity.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Feedback = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const user_entity_1 = __webpack_require__(/*! ./user.entity */ "./src/entities/user.entity.ts");
let Feedback = class Feedback {
};
exports.Feedback = Feedback;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Feedback.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Feedback.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.feedbacks),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], Feedback.prototype, "user", void 0);
exports.Feedback = Feedback = __decorate([
    (0, typeorm_1.Entity)()
], Feedback);


/***/ }),

/***/ "./src/entities/user.entity.ts":
/*!*************************************!*\
  !*** ./src/entities/user.entity.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
const feedback_entity_1 = __webpack_require__(/*! ./feedback.entity */ "./src/entities/feedback.entity.ts");
const bookings_entity_1 = __webpack_require__(/*! ./bookings.entity */ "./src/entities/bookings.entity.ts");
let User = class User {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'user' }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", String)
], User.prototype, "verificationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "verificationTokenExpiry", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, class_transformer_1.Transform)(({ value }) => value.toISOString()),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, class_transformer_1.Transform)(({ value }) => value.toISOString()),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => feedback_entity_1.Feedback, feedback => feedback.user, {
        eager: false,
        cascade: true
    }),
    __metadata("design:type", Array)
], User.prototype, "feedbacks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bookings_entity_1.Booking, booking => booking.user, {
        eager: false,
        cascade: true
    }),
    __metadata("design:type", Array)
], User.prototype, "bookings", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    __metadata("design:paramtypes", [typeof (_a = typeof Partial !== "undefined" && Partial) === "function" ? _a : Object])
], User);


/***/ }),

/***/ "./src/feedback/feedback.controller.ts":
/*!*********************************************!*\
  !*** ./src/feedback/feedback.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const feedback_service_1 = __webpack_require__(/*! ./feedback.service */ "./src/feedback/feedback.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/jwt.auth-guard */ "./src/auth/jwt.auth-guard.ts");
const create_feedback_dto_1 = __webpack_require__(/*! ../dto/create-feedback.dto */ "./src/dto/create-feedback.dto.ts");
let FeedbackController = class FeedbackController {
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }
    async create(req, createFeedbackDto) {
        return this.feedbackService.create(createFeedbackDto.content, req.user);
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_feedback_dto_1.CreateFeedbackDto !== "undefined" && create_feedback_dto_1.CreateFeedbackDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "create", null);
exports.FeedbackController = FeedbackController = __decorate([
    (0, common_1.Controller)('feedback'),
    __metadata("design:paramtypes", [typeof (_a = typeof feedback_service_1.FeedbackService !== "undefined" && feedback_service_1.FeedbackService) === "function" ? _a : Object])
], FeedbackController);


/***/ }),

/***/ "./src/feedback/feedback.module.ts":
/*!*****************************************!*\
  !*** ./src/feedback/feedback.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const feedback_controller_1 = __webpack_require__(/*! ./feedback.controller */ "./src/feedback/feedback.controller.ts");
const feedback_service_1 = __webpack_require__(/*! ./feedback.service */ "./src/feedback/feedback.service.ts");
const feedback_entity_1 = __webpack_require__(/*! ../entities/feedback.entity */ "./src/entities/feedback.entity.ts");
const user_entity_1 = __webpack_require__(/*! ../entities/user.entity */ "./src/entities/user.entity.ts");
let FeedbackModule = class FeedbackModule {
};
exports.FeedbackModule = FeedbackModule;
exports.FeedbackModule = FeedbackModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([feedback_entity_1.Feedback, user_entity_1.User])],
        controllers: [feedback_controller_1.FeedbackController],
        providers: [feedback_service_1.FeedbackService],
    })
], FeedbackModule);


/***/ }),

/***/ "./src/feedback/feedback.service.ts":
/*!******************************************!*\
  !*** ./src/feedback/feedback.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FeedbackService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const feedback_entity_1 = __webpack_require__(/*! ../entities/feedback.entity */ "./src/entities/feedback.entity.ts");
let FeedbackService = class FeedbackService {
    constructor(feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }
    async create(content, user) {
        const feedback = new feedback_entity_1.Feedback();
        feedback.content = content;
        feedback.user = user;
        return await this.feedbackRepository.save(feedback);
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(feedback_entity_1.Feedback)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], FeedbackService);


/***/ }),

/***/ "./src/guards/roles.guards.ts":
/*!************************************!*\
  !*** ./src/guards/roles.guards.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const decolators_1 = __webpack_require__(/*! ../decolators */ "./src/decolators.ts");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(decolators_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => user?.roles?.includes(role));
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),

/***/ "./src/interfaces/request.interface.ts":
/*!*********************************************!*\
  !*** ./src/interfaces/request.interface.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "@nestjs-modules/mailer":
/*!*****************************************!*\
  !*** external "@nestjs-modules/mailer" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = require("@nestjs-modules/mailer");

/***/ }),

/***/ "@nestjs-modules/mailer/dist/adapters/handlebars.adapter":
/*!**************************************************************************!*\
  !*** external "@nestjs-modules/mailer/dist/adapters/handlebars.adapter" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/typeorm":
/*!**********************************!*\
  !*** external "@nestjs/typeorm" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "date-fns":
/*!***************************!*\
  !*** external "date-fns" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("date-fns");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "reflect-metadata":
/*!***********************************!*\
  !*** external "reflect-metadata" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("reflect-metadata");

/***/ }),

/***/ "typeorm":
/*!**************************!*\
  !*** external "typeorm" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
__webpack_require__(/*! reflect-metadata */ "reflect-metadata");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3001', 'https://lockievisuals.vercel.app'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    await app.listen(3000);
}
bootstrap();

})();

/******/ })()
;