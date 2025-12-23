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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogReview = void 0;
const typeorm_1 = require("typeorm");
const blog_entity_1 = require("./blog.entity");
let BlogReview = class BlogReview {
};
exports.BlogReview = BlogReview;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BlogReview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BlogReview.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], BlogReview.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 5 }),
    __metadata("design:type", Number)
], BlogReview.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BlogReview.prototype, "blogId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => blog_entity_1.Blog, (blog) => blog.reviews, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'blogId' }),
    __metadata("design:type", blog_entity_1.Blog)
], BlogReview.prototype, "blog", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BlogReview.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BlogReview.prototype, "updatedAt", void 0);
exports.BlogReview = BlogReview = __decorate([
    (0, typeorm_1.Entity)('blog_reviews')
], BlogReview);
//# sourceMappingURL=blog-review.entity.js.map