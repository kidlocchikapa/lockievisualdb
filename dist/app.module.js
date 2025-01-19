"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const feedback_module_1 = require("./feedback/feedback.module");
const bookings_module_1 = require("./bookings/bookings.module");
const admin_module_1 = require("./admin/admin.module");
const user_entity_1 = require("./entities/user.entity");
const feedback_entity_1 = require("./entities/feedback.entity");
const bookings_entity_1 = require("./entities/bookings.entity");
const contact_entity_1 = require("./entities/contact.entity");
const email_service_1 = require("./email.service");
const contact_service_1 = require("./contact/contact.service");
const contact_controller_1 = require("./contact/contact.controller");
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
