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
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
const entities = require("./entities");
const auth_module_1 = require("./auth/auth.module");
const feedback_module_1 = require("./feedback/feedback.module");
const bookings_module_1 = require("./bookings/bookings.module");
const admin_module_1 = require("./admin/admin.module");
const blog_module_1 = require("./blog/blog.module");
const email_module_1 = require("./email.module");
const contact_module_1 = require("./contact/contact.module");
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
                        entities: Object.values(entities),
                        autoLoadEntities: true,
                        synchronize: !isProduction && !configService.get('DB_MIGRATIONS'),
                        migrations: ['dist/migrations/*.js'],
                        migrationsRun: configService.get('DB_MIGRATIONS', false),
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
                            migrationsRun: true,
                            synchronize: true,
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
            email_module_1.EmailModule,
            auth_module_1.AuthModule,
            feedback_module_1.FeedbackModule,
            bookings_module_1.BookingModule,
            admin_module_1.AdminModule,
            blog_module_1.BlogModule,
            contact_module_1.ContactModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: common_2.ClassSerializerInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map