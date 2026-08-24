import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('loki_chat_sessions')
export class LokiChatSession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Anonymous visitor device id (from x-loki-device header)
    @Index()
    @Column({ nullable: true })
    deviceId: string;

    // Set when the visitor is logged in
    @Index()
    @Column({ nullable: true })
    userId: string;

    @Column({ default: 'New chat' })
    title: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    lastMessageAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
