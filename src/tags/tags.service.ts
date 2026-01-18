import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagsRepository: Repository<TagEntity>,
    ) { }

    async create(createTagDto: CreateTagDto) {
        // Check if tag with same name or slug already exists
        const existingTag = await this.tagsRepository.findOne({
            where: [
                { name: createTagDto.name },
                { slug: createTagDto.slug },
            ],
        });

        if (existingTag) {
            throw new BadRequestException(
                'Tag with this name or slug already exists',
            );
        }

        const tag = this.tagsRepository.create(createTagDto);
        return this.tagsRepository.save(tag);
    }

    async findAll() {
        return this.tagsRepository.find({
            relations: ['posts'],
        });
    }

    async findOne(id: number) {
        const tag = await this.tagsRepository.findOne({
            where: { id },
            relations: ['posts'],
        });
        if (!tag) {
            throw new NotFoundException(`Tag with id ${id} not found`);
        }
        return tag;
    }

    async findBySlug(slug: string) {
        const tag = await this.tagsRepository.findOne({
            where: { slug },
            relations: ['posts'],
        });
        if (!tag) {
            throw new NotFoundException(`Tag with slug ${slug} not found`);
        }
        return tag;
    }

    async update(id: number, updateTagDto: UpdateTagDto) {
        // Check if trying to update to an existing name or slug
        if (updateTagDto.name || updateTagDto.slug) {
            const existingTag = await this.tagsRepository.findOne({
                where: [
                    { name: updateTagDto.name },
                    { slug: updateTagDto.slug },
                ],
            });

            if (existingTag && existingTag.id !== id) {
                throw new BadRequestException(
                    'Tag with this name or slug already exists',
                );
            }
        }

        const tag = await this.tagsRepository.preload({
            id,
            ...(updateTagDto as object),
        });
        if (!tag) {
            throw new NotFoundException(`Tag with id ${id} not found`);
        }
        return this.tagsRepository.save(tag);
    }

    async remove(id: number) {
        const tag = await this.findOne(id);
        return this.tagsRepository.remove(tag);
    }
}
