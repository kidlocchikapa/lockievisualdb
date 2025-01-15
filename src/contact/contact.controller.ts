// src/contact/contact.controller.ts
import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from '../dto/create-contact.dto';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { Roles, UserRole } from '../decolators';
import { RolesGuard } from '../guards/roles.guards';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.contactService.findAll();
  }
}