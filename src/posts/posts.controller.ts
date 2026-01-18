import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
    }

    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @Get('user/:userId')
    findByUserId(@Param('userId') userId: string) {
        return this.postsService.findByUserId(+userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(+id);
    }

    @Post(':id/tags')
    addTags(@Param('id') id: string, @Body() body: { tagIds: number[] }) {
        return this.postsService.addTagsToPost(+id, body.tagIds);
    }

    @Delete(':id/tags')
    removeTags(@Param('id') id: string, @Body() body: { tagIds: number[] }) {
        return this.postsService.removeTagsFromPost(+id, body.tagIds);
    }

    @Patch(':id/tags')
    setTags(@Param('id') id: string, @Body() body: { tagIds: number[] }) {
        return this.postsService.setPostTags(+id, body.tagIds);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(+id, updatePostDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.postsService.remove(+id);
    }
}
