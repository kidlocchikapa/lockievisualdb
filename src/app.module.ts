import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

// Modules
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { BookingModule } from './bookings/bookings.module';

// Entities
import { User } from './entities/user.entity';
import { Feedback } from './entities/feedback.entity';
import { Booking } from './entities/bookings.entity';
import { Contact } from './entities/contact.entity';

// Services
import { EmailService } from './email.service';
import { ContactService } from './contact/contact.service';

// Controllers
import { ContactController } from './contact/contact.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // Define isProduction here
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        
        return {
          type: 'postgres',
          logging: !isProduction, // Disable logging in production
          ...(isProduction
            ? {
                url: configService.get<string>('DATABASE_URL'),
                ssl: {
                  rejectUnauthorized: true, // Avoid rejectUnauthorized: false in production
                },
                synchronize: false, // Don't sync schema automatically in production
              }
            : {
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
              }),
          entities: [User, Feedback, Booking, Contact],
          autoLoadEntities: false, // Manually load entities for production
        };
      },
    }),

    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // Define isProduction here for MailerModule
        const isProduction = configService.get<string>('NODE_ENV') === 'production';

        return {
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
              rejectUnauthorized: true, // Enforce secure TLS connection
            },
          },
          defaults: {
            from: `"Lockie Visuals" <${configService.get('EMAIL_USER')}>`,
          },
          template: {
            dir: process.cwd() + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: !isProduction, // Disable strict mode in production
            },
          },
        };
      },
    }),

    AuthModule,
    FeedbackModule,
    BookingModule,
    TypeOrmModule.forFeature([Contact]),
  ],
  controllers: [
    ContactController,
  ],
  providers: [
    EmailService,
    ContactService,
  ],
  exports: [EmailService],
})
export class AppModule {}
