import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn
} from 'typeorm';
import { Blog } from './blog.entity';

@Entity('blog_reviews')
export class BlogReview {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text' })
    comment: string;

    @Column({ type: 'int', default: 5 })
    rating: number;

    @Column()
    blogId: string;

    @ManyToOne(() => Blog, (blog) => blog.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'blogId' })
    blog: Blog;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
