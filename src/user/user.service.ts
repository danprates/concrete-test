import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { SignupDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: SignupDto): Promise<User> {
    try {
      const user = this.userRepository.create(data);
      await user.save();

      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          { message: 'Email already exists' },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }
}
