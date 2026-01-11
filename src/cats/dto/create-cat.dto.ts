import {
  IsString,
  IsNumber,
  MinLength,
  MaxLength,
  Max,
  Min,
} from 'class-validator';

export class CreateCatDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;
  @IsNumber()
  @Min(0)
  @Max(30)
  age: number;
  @IsString()
  @MinLength(0)
  @MaxLength(255)
  breed: string;
}
