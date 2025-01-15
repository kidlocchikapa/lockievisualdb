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
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        
        return {
          type: 'postgres',
          logging: true,
          ...(isProduction
            ? {
                url: configService.get<string>('DATABASE_URL'),
                ssl: {
                  rejectUnauthorized: false,
                },
                synchronize: false,
              }
            : {
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
              }),
          entities: [User, Feedback, Booking, Contact], // Added Contact entity
          autoLoadEntities: true,
        };
      },
    }),
    
    MailerModule.forRootAsync({
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
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"Lockie Visuals" <${configService.get('EMAIL_USER')}>`,
        },
        template: {
          dir: process.cwd() + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    
    AuthModule,
    FeedbackModule,
    BookingModule,
    TypeOrmModule.forFeature([Contact]), // Added TypeOrmModule for Contact
  ],
  controllers: [
    ContactController, // Added ContactController
  ],
  providers: [
    EmailService,
    ContactService, // Added ContactService
  ],
  exports: [EmailService],
})
export class AppModule {}
