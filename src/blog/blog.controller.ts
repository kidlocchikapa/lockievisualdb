import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    ParseIntPipe,
    Query
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from '../entities/blog.entity';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { RolesGuard } from '../auth/roles.guards';
import { Roles, UserRole } from '../decolators';

@Controller('blogs')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    // Public: Fetch all blogs
    @Get()
    async findAll(@Query('onlyPublished') onlyPublished?: string) {
        const showOnlyPublished = onlyPublished !== 'false';
        return await this.blogService.findAll(showOnlyPublished);
    }

    // Public: Fetch a single blog
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.blogService.findOne(id);
    }

    // Admin: Create a blog
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    async create(@Body() blogData: Partial<Blog>) {
        return await this.blogService.create(blogData);
    }

    // Admin: Update a blog
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() blogData: Partial<Blog>) {
        return await this.blogService.update(id, blogData);
    }

    // Admin: Delete a blog
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.blogService.remove(id);
        return { message: 'Blog deleted successfully' };
    }
}
