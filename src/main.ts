import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import "reflect-metadata";
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Enable raw body for webhook signature verification
  });

  app.enableCors({
    origin: (origin, callback) => {
      // Allow any localhost origin (including subdomains) or the production app
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === 'https://lockievisuals.vercel.app') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Signature'], // Add Signature header for webhooks
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Listen on all network interfaces
}
bootstrap();