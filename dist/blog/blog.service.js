"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let BlogService = class BlogService {
    constructor(blogRepository, reviewRepository) {
        this.blogRepository = blogRepository;
        this.reviewRepository = reviewRepository;
    }
    async create(blogData) {
        const blog = this.blogRepository.create(blogData);
        return await this.blogRepository.save(blog);
    }
    async findAll(onlyPublished = true) {
        const where = onlyPublished ? { isPublished: true } : {};
        return await this.blogRepository.find({
            where,
            relations: ['reviews'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const blog = await this.blogRepository.findOne({
            where: { id },
            relations: ['reviews']
        });
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with ID ${id} not found`);
        }
        return blog;
    }
    async update(id, blogData) {
        const blog = await this.findOne(id);
        Object.assign(blog, blogData);
        return await this.blogRepository.save(blog);
    }
    async remove(id) {
        const blog = await this.findOne(id);
        await this.blogRepository.remove(blog);
    }
    async addReview(blogId, reviewData) {
        const blog = await this.findOne(blogId);
        const review = this.reviewRepository.create({
            ...reviewData,
            blogId: blog.id,
        });
        return await this.reviewRepository.save(review);
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Blog)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.BlogReview)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BlogService);
//# sourceMappingURL=blog.service.js.map