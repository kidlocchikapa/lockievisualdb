import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Feedback } from '../entities/feedback.entity';
import { Booking } from '../entities/bookings.entity';
import { config } from 'dotenv';
import { parse } from 'pg-connection-string';

// Load environment variables from .env
config();

const databaseUrl = process.env.DATABASE_URL;

// Parse `DATABASE_URL` for production if it exists
const isProduction = !!databaseUrl;
const parsed = databaseUrl ? parse(databaseUrl) : null;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: isProduction ? parsed?.host : process.env.DB_HOST,
  port: isProduction
    ? parseInt(parsed?.port || '5432', 10)
    : parseInt(process.env.DB_PORT || '5432', 10),
  username: isProduction ? parsed?.user : process.env.DB_USERNAME,
  password: isProduction ? parsed?.password : process.env.DB_PASSWORD,
  database: isProduction ? parsed?.database : process.env.DB_DATABASE,
  entities: [User, Feedback, Booking],
  migrations: ['dist/migrations/*.js'], // Adjust for production builds
  synchronize: false,
  ssl: isProduction
    ? {
        rejectUnauthorized: false, // Required for some hosting providers (e.g., Render)
      }
    : undefined,
});
