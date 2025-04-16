import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';

import { LoggerOptions } from 'typeorm';

import * as entities from './entities'; // Ensure these are all classes (not objects/functions)

// Modules
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { BookingModule } from './bookings/bookings.module';
import { AdminModule } from './admin/admin.module';

// Services and Controllers
import { EmailService } from './email.service';
import { ContactService } from './contact/contact.service';
import { ContactController } from './contact/contact.controller';
import { Contact } from './entities/contact.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
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
            synchronize: false,
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

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
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
          adapter: new HandlebarsAdapter(),
          options: {
            strict: false,
          },
        },
        preview: configService.get('NODE_ENV') !== 'production',
      }),
    }),

    // App feature modules
    AuthModule,
    FeedbackModule,
    BookingModule,
    AdminModule,

    // Single entity for contact module
    TypeOrmModule.forFeature([Contact]),
  ],

  controllers: [ContactController],

  providers: [
    EmailService,
    ContactService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],

  exports: [EmailService],
})
export class AppModule {}
