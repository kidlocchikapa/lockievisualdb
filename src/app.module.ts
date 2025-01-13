import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { User } from './entities/user.entity';
import { Feedback } from './entities/feedback.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes env variables available globally
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Feedback],
      synchronize: true, // Set to false in production
      ssl: {
        rejectUnauthorized: false, // Required for external connections to Render
      },
    }),
    AuthModule,
    FeedbackModule,
  ],
})
export class AppModule {}
