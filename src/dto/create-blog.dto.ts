import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean()
    isPublished?: boolean;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean()
    showcaseEnabled?: boolean;

    @IsOptional()
    @IsString()
    showcaseImage?: string;

    @IsOptional()
    @IsString()
    showcaseCta?: string;

    @IsOptional()
    @IsString()
    showcaseTitle?: string;

    @IsOptional()
    @IsString()
    showcaseDescription?: string;
}
