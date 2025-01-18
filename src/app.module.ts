import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

// Modules
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { BookingModule } from './bookings/bookings.module';
import { AdminModule } from './admin/admin.module';

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
      isGlobal: true, // Ensures configuration is globally available
    }),

    // Database connection
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';

        // Handling database configuration for production vs local environments
        const databaseConfig = isProduction
          ? {
              url: configService.get<string>('DATABASE_URL'),
              ssl: true,
              extra: {
                ssl: {
                  rejectUnauthorized: false, // Allows self-signed certificates in production
                },
              },
              pool: {
                max: 20,
                connectionTimeoutMillis: 10000,
                idleTimeoutMillis: 30000,
              },
            }
          : {
              host: configService.get<string>('DB_HOST'),
              port: configService.get<number>('DB_PORT', 5432),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_NAME'),
              synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false), // Should be false in production
            };

        // Return TypeORM connection configuration
        return {
          type: 'postgres',
          logging: isProduction
            ? ['error', 'warn']
            : ['query', 'error', 'schema', 'warn', 'info', 'log'], // Adjust logging based on environment
          entities: [User, Feedback, Booking, Contact], // Ensure all entities are included
          autoLoadEntities: false, // Controls entity loading. Set to true for automatic entity discovery.
          ...databaseConfig,
        };
      },
    }),

    // Mailer configuration
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
            rejectUnauthorized: true, // For secure connection in production
          },
        },
        defaults: {
          from: `"Lockie Visuals" <${configService.get('EMAIL_USER')}>`, // Default email from address
        },
        template: {
          dir: process.cwd() + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: false, // Allow missing template variables
          },
        },
      }),
    }),

    // Feature modules
    AuthModule,
    FeedbackModule,
    BookingModule,
    AdminModule,


    // Entities for TypeORM
    TypeOrmModule.forFeature([Contact]), // Import Contact repository for the service
  ],
  controllers: [ContactController], // Register the Contact controller
  providers: [EmailService, ContactService], // Register email and contact services
  exports: [EmailService], // Export EmailService for use in other modules
})
export class AppModule {}
