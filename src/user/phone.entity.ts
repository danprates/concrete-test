import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('phones')
export class Phone extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, nullable: true })
  value: string;

  @Column({ length: 255, nullable: true })
  ddd: string;

  @Column({ nullable: false, name: 'user_id' })
  userId: string;

  @ManyToOne(
    () => User,
    user => user.phones,
  )
  user: User;
}
