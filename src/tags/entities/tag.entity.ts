import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity('tags')
export class TagEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    slug: string;

    @ManyToMany(() => PostEntity, (post) => post.tags, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinTable({
        name: 'post_tags',
        joinColumn: { name: 'tag_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
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
