import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailerModule } from '@nestjs-modules/mailer';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';

import { LoggerOptions } from 'typeorm';

import * as entities from './entities'; // Ensure these are all classes (not objects/functions)
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Modules
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { BookingModule } from './bookings/bookings.module';
import { AdminModule } from './admin/admin.module';
import { BlogModule } from './blog/blog.module';

// Services and Controllers
import { EmailModule } from './email.module';
import { ContactModule } from './contact/contact.module';
import { ServiceModule } from './service/service.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';

        const baseConfig = {
          type: 'postgres' as const,
          logging: isProduction ? ['error'] as LoggerOptions : true,
          entities: Object.values(entities) as (Function | string)[],
          autoLoadEntities: true,
          synchronize: !isProduction && !configService.get<boolean>('DB_MIGRATIONS'),
          migrations: ['dist/migrations/*.js'],
          migrationsRun: configService.get<boolean>('DB_MIGRATIONS', false),
          retryAttempts: 3,
          retryDelay: 3000,
        };

        if (isProduction) {
          return {
            ...baseConfig,
            url: configService.get<string>('DATABASE_URL'),
            ssl: {
              rejectUnauthorized: false,
            },
            migrationsRun: true,
            synchronize: true,
          };
        }

        return {
          ...baseConfig,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
        };
      },
    }),

    EmailModule,

    // App feature modules
    AuthModule,
    FeedbackModule,
    BookingModule,
    AdminModule,
    BlogModule,
    ContactModule,
    ServiceModule,
    PaymentModule,

    // Single entity for contact module
  ],

  controllers: [],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],

})
export class AppModule { }
