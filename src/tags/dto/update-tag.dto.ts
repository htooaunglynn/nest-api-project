import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateTagDto {
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(100)
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(100)
    slug?: string;
}
