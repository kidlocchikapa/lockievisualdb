import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../entities/blog.entity';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>,
    ) { }

    async create(blogData: Partial<Blog>): Promise<Blog> {
        const blog = this.blogRepository.create(blogData);
        return await this.blogRepository.save(blog);
    }

    async findAll(onlyPublished = true): Promise<Blog[]> {
        const where = onlyPublished ? { isPublished: true } : {};
        return await this.blogRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Blog> {
        const blog = await this.blogRepository.findOne({ where: { id } });
        if (!blog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }
        return blog;
    }

    async update(id: number, blogData: Partial<Blog>): Promise<Blog> {
        const blog = await this.findOne(id);
        Object.assign(blog, blogData);
        return await this.blogRepository.save(blog);
    }

    async remove(id: number): Promise<void> {
        const blog = await this.findOne(id);
        await this.blogRepository.remove(blog);
    }
}
