// entities/feedback.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  content: string;

  @Column({ nullable: true })
  adminResponse: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, user => user.feedbacks)
  user: User;
}