import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  getCats(@Query() query: { name: string }) {
    if (query.name) {
      return this.catsService.findByName(query.name);
    }
    return this.catsService.findAll();
  }

  @Get(':id')
  getCat(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(Number(id));
  }

  @Post()
  createCat(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Put(':id')
  updateCat(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCatDto: CreateCatDto,
  ) {
    return this.catsService.update(Number(id), updateCatDto);
  }

  @Delete(':id')
  deleteCat(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.delete(Number(id));
  }
}
