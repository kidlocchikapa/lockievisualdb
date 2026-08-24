import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Headers } from '@nestjs/common';
import { Request } from 'express';

import { LokiService } from './loki.service';
import { LokiIndexerService } from './loki-indexer.service';
import { LokiChatDto } from './dto/chat.dto';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { UpdateKnowledgeDto } from './dto/update-knowledge.dto';
import { LokiKnowledge } from './entities/loki-knowledge.entity';

import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { RolesGuard } from '../auth/roles.guards';
import { Roles, UserRole } from '../decolators';
import { LokiKnowledgeService } from './loki-knowledge.service';

@Controller('loki')
export class LokiController {
    constructor(
        private readonly lokiService: LokiService,
        private readonly indexer: LokiIndexerService,
        private readonly knowledgeService: LokiKnowledgeService,
    ) {}

    private identity(req: Request): { deviceId?: string; userId?: string } {
        const deviceId = req.headers['x-loki-device'] ? String(req.headers['x-loki-device']) : undefined;
        const reqAny = req as any;
        const userId = reqAny?.user?.id ? String(reqAny.user.id) : undefined;
        return { deviceId, userId };
    }

    @Post('chat')
    chat(@Req() req: Request, @Body() body: LokiChatDto) {
        const { deviceId, userId } = this.identity(req);
        return this.lokiService.chat({
            message: body.message,
            sessionId: body.sessionId,
            deviceId,
            userId,
        });
    }

    @Get('sessions')
    sessions(@Req() req: Request) {
        const { deviceId, userId } = this.identity(req);
        return this.lokiService.listSessions(deviceId, userId);
    }

    @Get('sessions/:id/messages')
    sessionMessages(@Req() req: Request, @Param('id') id: string) {
        const { deviceId, userId } = this.identity(req);
        return this.lokiService.getSessionMessages(id, deviceId, userId);
    }

    @Delete('sessions/:id')
    deleteSession(@Req() req: Request, @Param('id') id: string) {
        const { deviceId, userId } = this.identity(req);
        return this.lokiService.deleteSession(id, deviceId, userId);
    }

    // ---- Admin: teach Loki new things about the company ----

    @Get('admin/knowledge')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    listKnowledge(): Promise<LokiKnowledge[]> {
        return this.knowledgeService.findAll();
    }

    @Post('admin/knowledge')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async createKnowledge(@Body() dto: CreateKnowledgeDto) {
        const created = await this.knowledgeService.create(dto);
        await this.indexer.reindex();
        return created;
    }

    @Put('admin/knowledge/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async updateKnowledge(@Param('id') id: string, @Body() dto: UpdateKnowledgeDto) {
        const updated = await this.knowledgeService.update(id, dto);
        await this.indexer.reindex();
        return updated;
    }

    @Delete('admin/knowledge/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async deleteKnowledge(@Param('id') id: string) {
        await this.knowledgeService.remove(id);
        await this.indexer.reindex();
        return { deleted: true };
    }

    @Post('admin/reindex')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    reindex() {
        return this.indexer.reindex();
    }
}
