import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(255)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    content: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    slug?: string;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsArray()
    @IsOptional()
    @IsNumber({}, { each: true })
    tagIds?: number[];
}
