// src/data-source.ts
import { DataSource } from 'typeorm';
import { EntitySchema } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import * as entities from './entities'; // Import all entities
import * as dotenv from 'dotenv';

dotenv.config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.get('DATABASE_URL'),
  entities: Object.values(entities) as (Function | string | EntitySchema<any>)[],
  // Automatically includes all exported entities
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false, // Always false for production!
  logging: true,
  ssl: configService.get('NODE_ENV') === 'production'
    ? { rejectUnauthorized: false }
    : false,
});