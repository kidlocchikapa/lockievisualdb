import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateKnowledgeDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(10000)
    content: string;

    @IsOptional()
    @IsString()
    @MaxLength(60)
    category?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
