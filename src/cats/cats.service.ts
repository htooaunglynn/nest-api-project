import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CatEntity } from './entity/cats.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(CatEntity)
    private catsRepository: Repository<CatEntity>,
  ) {}

  findAll(): Promise<CatEntity[]> {
    return this.catsRepository.find();
  }

  findOne(id: number): Promise<CatEntity | null> {
    return this.catsRepository.findOneBy({ id });
  }

  create(createCatDto: CreateCatDto): Promise<CatEntity | null> {
    return this.catsRepository.save({ ...createCatDto });
  }

  async update(
    id: number,
    createCatDto: CreateCatDto,
  ): Promise<CatEntity | null> {
    await this.catsRepository.update(id, createCatDto);
    return this.catsRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.catsRepository.delete(id);
  }

  findByName(name: string): Promise<CatEntity[] | null> {
    return this.catsRepository.find({ where: { name } });
  }
}
