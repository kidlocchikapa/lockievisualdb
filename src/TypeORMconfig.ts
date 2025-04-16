// src/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { EntitySchema } from 'typeorm';

import * as entities from './entities';

export const getTypeOrmConfig = async (
  configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  url: configService.get('DATABASE_URL'),
  entities: Object.values(entities) as (Function | string | EntitySchema<any>)[],
  synchronize: configService.get('NODE_ENV') !== 'production',
  logging: configService.get('NODE_ENV') === 'development',
  migrations: [__dirname + 'dist/migrations/*{.ts,.js}'],

  ssl: configService.get('NODE_ENV') === 'production' 
    ? { rejectUnauthorized: false } 
    : undefined,
});