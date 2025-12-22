import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    Query,
    UseInterceptors,
    UploadedFile,
    UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BlogService } from './blog.service';
import { Blog } from '../entities/blog.entity';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { RolesGuard } from '../auth/roles.guards';
import { Roles, UserRole } from '../decolators';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';

@Controller('blogs')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    private static storageConfig = {
        storage: diskStorage({
            destination: './uploads/blogs',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    };

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
    @UseInterceptors(FileInterceptor('image', BlogController.storageConfig))
    async create(
        @UploadedFile() file: any,
        @Body() blogData: CreateBlogDto
    ) {
        console.log('--- DEBUG START ---');
        console.log('File:', file ? file.originalname : 'No File');
        console.log('Body:', blogData);
        if (file) {
            blogData.imageUrl = `/uploads/blogs/${file.filename}`;
        }
        // Boolean conversion handled by DTO Transform
        return await this.blogService.create(blogData);
    }

    // Admin: Update a blog
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')

    @UseInterceptors(FileInterceptor('image', BlogController.storageConfig))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: any,
        @Body() blogData: UpdateBlogDto
    ) {
        if (file) {
            blogData.imageUrl = `/uploads/blogs/${file.filename}`;
        }
        // Boolean conversion handled by DTO Transform
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
