// feedback/feedback.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../entities/feedback.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) { }

  async create(content: string, user: User) {
    const feedback = new Feedback();
    feedback.content = content;
    feedback.user = user;
    return await this.feedbackRepository.save(feedback);
  }

  async findAll() {
    return await this.feedbackRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async respond(id: number, response: string) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['user']
    });
    if (!feedback) {
      throw new Error('Feedback not found');
    }
    feedback.adminResponse = response;
    feedback.isRead = true;
    return await this.feedbackRepository.save(feedback);
  }

  async markAsRead(id: number) {
    return await this.feedbackRepository.update(id, { isRead: true });
  }

  async getUnreadCount() {
    return await this.feedbackRepository.count({ where: { isRead: false } });
  }
}