// src/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  PHOTOGRAPHER = 'photographer'
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);