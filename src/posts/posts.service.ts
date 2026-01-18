import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { UsersService } from '../users/users.service';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postsRepository: Repository<PostEntity>,
        private readonly usersService: UsersService,
        private readonly tagsService: TagsService,
    ) { }

    async create(createPostDto: CreatePostDto) {
        // Verify user exists
        const user = await this.usersService.findOne(createPostDto.userId);
        if (!user) {
            throw new BadRequestException(
                `User with id ${createPostDto.userId} not found`,
            );
        }

        // Load tags if provided
        let tags = [];
        if (createPostDto.tagIds && createPostDto.tagIds.length > 0) {
            tags = await this.postsRepository.manager
                .createQueryBuilder()
                .select('tag')
                .from('TagEntity', 'tag')
                .where('tag.id IN (:...ids)', { ids: createPostDto.tagIds })
                .getMany();

            if (tags.length !== createPostDto.tagIds.length) {
                throw new BadRequestException(
                    'Some tags do not exist',
                );
            }
        }

        const post = this.postsRepository.create({
            title: createPostDto.title,
            content: createPostDto.content,
            slug: createPostDto.slug,
            userId: createPostDto.userId,
            tags,
        } as Partial<PostEntity>);

        return this.postsRepository.save(post);
    }

    async findAll() {
        return this.postsRepository.find({
            relations: ['user', 'tags'],
        });
    }

    async findOne(id: number) {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['user', 'tags'],
        });
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        return post;
    }

    async findByUserId(userId: number) {
        // Verify user exists
        await this.usersService.findOne(userId);

        return this.postsRepository.find({
            where: { userId },
            relations: ['user', 'tags'],
        });
    }

    async addTagsToPost(postId: number, tagIds: number[]) {
        const post = await this.findOne(postId);

        // Verify all tags exist
        const tags = await this.postsRepository.manager
            .createQueryBuilder()
            .select('tag')
            .from('TagEntity', 'tag')
            .where('tag.id IN (:...ids)', { ids: tagIds })
            .getMany();

        if (tags.length !== tagIds.length) {
            throw new BadRequestException('Some tags do not exist');
        }

        post.tags = [...(post.tags || []), ...tags];
        return this.postsRepository.save(post);
    }

    async removeTagsFromPost(postId: number, tagIds: number[]) {
        const post = await this.findOne(postId);

        post.tags = (post.tags || []).filter(
            (tag) => !tagIds.includes(tag.id),
        );
        return this.postsRepository.save(post);
    }

    async setPostTags(postId: number, tagIds: number[]) {
        const post = await this.findOne(postId);

        if (tagIds.length === 0) {
            post.tags = [];
            return this.postsRepository.save(post);
        }

        // Verify all tags exist
        const tags = await this.postsRepository.manager
            .createQueryBuilder()
            .select('tag')
            .from('TagEntity', 'tag')
            .where('tag.id IN (:...ids)', { ids: tagIds })
            .getMany();

        if (tags.length !== tagIds.length) {
            throw new BadRequestException('Some tags do not exist');
        }

        post.tags = tags;
        return this.postsRepository.save(post);
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        // If userId is being updated, verify the user exists
        if (updatePostDto.userId) {
            const user = await this.usersService.findOne(updatePostDto.userId);
            if (!user) {
                throw new BadRequestException(
                    `User with id ${updatePostDto.userId} not found`,
                );
            }
        }

        const post = await this.postsRepository.preload({
            id,
            ...(updatePostDto as object),
        });
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        return this.postsRepository.save(post);
    }

    async remove(id: number) {
        const post = await this.findOne(id);
        return this.postsRepository.remove(post);
    }
}
