import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    icon: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}
