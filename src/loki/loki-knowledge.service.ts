import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LokiKnowledge } from './entities/loki-knowledge.entity';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { UpdateKnowledgeDto } from './dto/update-knowledge.dto';

@Injectable()
export class LokiKnowledgeService {
    constructor(
        @InjectRepository(LokiKnowledge)
        private readonly repo: Repository<LokiKnowledge>,
    ) {}

    findAll(): Promise<LokiKnowledge[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    create(dto: CreateKnowledgeDto): Promise<LokiKnowledge> {
        const entry = this.repo.create(dto);
        return this.repo.save(entry);
    }

    async update(id: string, dto: UpdateKnowledgeDto): Promise<LokiKnowledge> {
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id } });
    }

    async remove(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
