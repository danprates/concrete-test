import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
  BeforeInsert,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { createHmac } from 'crypto';
import { ENCRIPTION_SALT } from '../config/constants.config';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, nullable: false })
  name: string;

  @Unique('email', ['email'])
  @Column({ length: 255, nullable: false })
  email: string;

  @Exclude()
  @Column({ length: 255, nullable: false, select: false })
  password: string;

  @Column({ length: 255, nullable: true })
  token: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'last_login',
  })
  lastLogin: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  private hashPassword(password: string): string {
    return createHmac('sha256', ENCRIPTION_SALT)
      .update(password)
      .digest('hex');
  }

  comparePassword(password: string): boolean {
    return this.password === this.hashPassword(password);
  }

  @BeforeInsert()
  private beforeInsert(): void {
    if (this.password) {
      this.password = this.hashPassword(this.password);
    }
  }
}
