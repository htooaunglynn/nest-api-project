import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    const { userId, ...rest } = createProfileDto as any;
    const profile = this.profilesRepository.create({
      ...rest,
      user: userId ? ({ id: userId } as UserEntity) : undefined,
    } as Partial<Profile>);
    return this.profilesRepository.save(profile);
  }

  async findAll() {
    return this.profilesRepository.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const profile = await this.profilesRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profile)
      throw new NotFoundException(`Profile with id ${id} not found`);
    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const { userId, ...rest } = updateProfileDto as any;
    const toPreload: any = { id, ...rest };
    if (userId !== undefined) toPreload.user = { id: userId } as UserEntity;

    const profile = await this.profilesRepository.preload(toPreload);
    if (!profile)
      throw new NotFoundException(`Profile with id ${id} not found`);
    return this.profilesRepository.save(profile);
  }

  async remove(id: number) {
    const profile = await this.findOne(id);
    return this.profilesRepository.remove(profile);
  }
}
