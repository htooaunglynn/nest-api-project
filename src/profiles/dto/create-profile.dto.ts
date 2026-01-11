import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  photo: string;

  @IsString()
  @MinLength(0)
  @MaxLength(1000)
  bio: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsInt()
  userId: number;
}
