import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('loki_knowledge')
export class LokiKnowledge {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    content: string;

    // e.g. 'about', 'policies', 'faq', 'process', 'team'
    @Column({ nullable: true })
    category: string;

    @Column({ type: 'jsonb', nullable: true })
    tags: string[];

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
