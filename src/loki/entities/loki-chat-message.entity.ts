import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { LokiChatSession } from './loki-chat-session.entity';

@Entity('loki_chat_messages')
export class LokiChatMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column('uuid')
    sessionId: string;

    @ManyToOne(() => LokiChatSession, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sessionId' })
    session: LokiChatSession;

    // 'user' | 'assistant'
    @Column()
    role: string;

    @Column('text')
    content: string;

    @CreateDateColumn()
    createdAt: Date;
}
