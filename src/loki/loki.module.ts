import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LokiKnowledge } from './entities/loki-knowledge.entity';
import { LokiChatSession } from './entities/loki-chat-session.entity';
import { LokiChatMessage } from './entities/loki-chat-message.entity';
import { Service } from '../entities/service.entity';
import { Blog } from '../entities/blog.entity';

import { GeminiService } from './gemini.service';
import { LokiIndexerService } from './loki-indexer.service';
import { LokiService } from './loki.service';
import { LokiKnowledgeService } from './loki-knowledge.service';
import { LokiController } from './loki.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([LokiKnowledge, LokiChatSession, LokiChatMessage, Service, Blog]),
  ],
  controllers: [LokiController],
  providers: [GeminiService, LokiIndexerService, LokiService, LokiKnowledgeService],
  exports: [LokiService],
})
export class LokiModule {}
