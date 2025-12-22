import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(Service)
        private serviceRepository: Repository<Service>,
    ) { }

    async create(createServiceDto: CreateServiceDto): Promise<Service> {
        const service = this.serviceRepository.create(createServiceDto);
        return await this.serviceRepository.save(service);
    }

    async findAll(): Promise<Service[]> {
        return await this.serviceRepository.find({
            order: { createdAt: 'ASC' }
        });
    }

    async findOne(id: number): Promise<Service> {
        const service = await this.serviceRepository.findOne({ where: { id } });
        if (!service) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }
        return service;
    }

    async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service> {
        const service = await this.findOne(id);
        Object.assign(service, updateServiceDto);
        return await this.serviceRepository.save(service);
    }

    async remove(id: number): Promise<void> {
        const result = await this.serviceRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }
    }
}
