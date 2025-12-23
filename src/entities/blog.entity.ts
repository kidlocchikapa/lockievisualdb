import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

import { BlogReview } from './blog-review.entity';

@Entity()
export class Blog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => BlogReview, (review) => review.blog, { cascade: true })
    reviews: BlogReview[];

    @Column()
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column()
    author: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ nullable: true })
    category: string;

    @Column({ default: true })
    isPublished: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
