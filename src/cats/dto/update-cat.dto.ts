import { CreateCatDto } from './create-cat.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCatDto extends PartialType(CreateCatDto) {}
