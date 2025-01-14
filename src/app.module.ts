import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { BookingModule } from './bookings/bookings.module';
import { User } from './entities/user.entity';
import { Feedback } from './entities/feedback.entity';
import { Booking } from './entities/bookings.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';

        return {
          type: 'postgres',
          ...(isProduction
            ? {
                url: configService.get<string>('DATABASE_URL'),
                ssl: {
                  rejectUnauthorized: false,
                },
              }
            : {
                host: configService.get<string>('DB_HOST', 'localhost'),
                port: configService.get<number>('DB_PORT', 5432),
                username: configService.get<string>('DB_USERNAME', 'postgres'),
                password: configService.get<string>('DB_PASSWORD', 'postgres'),
                database: configService.get<string>('DB_NAME', 'mydatabase'),
              }),
          entities: [User, Feedback, Booking], // Add Booking entity here
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
        };
      },
    }),
    AuthModule,
    FeedbackModule,
    BookingModule, // Add BookingModule here
  ],
})
export class AppModule {}
