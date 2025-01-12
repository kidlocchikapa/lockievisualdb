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
  ) {}

  async create(content: string, user: User) {
    // Create new feedback instance
    const feedback = new Feedback();
    feedback.content = content;
    feedback.user = user;

    // Save and return the feedback
    return await this.feedbackRepository.save(feedback);
  }
}