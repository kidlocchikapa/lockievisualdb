import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import "reflect-metadata";
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001', 'https://lockievisuals.vercel.app'], // Add your frontend URL
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  await app.listen(3000);
}
bootstrap();