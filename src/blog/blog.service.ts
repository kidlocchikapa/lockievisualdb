import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog, BlogReview } from '../entities';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>,
        @InjectRepository(BlogReview)
        private reviewRepository: Repository<BlogReview>,
    ) { }

    async create(blogData: Partial<Blog>): Promise<Blog> {
        const blog = this.blogRepository.create(blogData);
        return await this.blogRepository.save(blog);
    }

    async findAll(onlyPublished = true): Promise<Blog[]> {
        const where = onlyPublished ? { isPublished: true } : {};
        return await this.blogRepository.find({
            where,
            relations: ['reviews'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Blog> {
        const blog = await this.blogRepository.findOne({
            where: { id },
            relations: ['reviews']
        });
        if (!blog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }
        return blog;
    }

    async update(id: string, blogData: Partial<Blog>): Promise<Blog> {
        const blog = await this.findOne(id);
        Object.assign(blog, blogData);
        return await this.blogRepository.save(blog);
    }

    async remove(id: string): Promise<void> {
        const blog = await this.findOne(id);
        await this.blogRepository.remove(blog);
    }

    async addReview(blogId: string, reviewData: Partial<BlogReview>): Promise<BlogReview> {
        const blog = await this.findOne(blogId);
        const review = this.reviewRepository.create({
            ...reviewData,
            blogId: blog.id,
        });
        return await this.reviewRepository.save(review);
    }
}
