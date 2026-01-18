import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 225 })
    name: string;

    @Column({ type: 'varchar', length: 225, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 225 })
    password: string;

    @OneToMany(() => PostEntity, (post) => post.user, {
        cascade: true,
        eager: false,
    })
    posts: PostEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
}
