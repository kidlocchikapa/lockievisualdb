// src/interfaces/request.interface.ts
import { Request } from 'express';
import { User } from '../entities/user.entity';

export interface CustomRequest extends Request {
  user: User;
}