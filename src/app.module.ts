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
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Chloe01.24',
      database: 'lockievisuals',
      entities: [User, Feedback],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    FeedbackModule,
  ],
})
export class AppModule {}