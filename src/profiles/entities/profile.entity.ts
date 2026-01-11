import { UserEntity } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  photo: string;

  @Column({ type: 'varchar', length: 255 })
  bio: string;

  @Column({ type: 'int' })
  age: number;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
