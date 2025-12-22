import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { RolesGuard } from '../auth/roles.guards';
import { Roles, UserRole } from '../decolators';

@Controller('services')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createServiceDto: CreateServiceDto) {
        return this.serviceService.create(createServiceDto);
    }

    @Get()
    findAll() {
        return this.serviceService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.serviceService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id', ParseIntPipe) id: number, @Body() updateServiceDto: UpdateServiceDto) {
        return this.serviceService.update(id, updateServiceDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.serviceService.remove(id);
    }
}
