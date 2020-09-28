import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { Phone } from './phone.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
  ) {}

  async create({ phones, ...data }: SignupDto): Promise<any> {
    try {
      const user = this.userRepository.create(data);
      await user.save();

      if (phones && phones.length > 0) {
        const phoneData = phones.map(phone => ({ ...phone, userId: user.id }));
        user.phones = await this.phoneRepository.save(phoneData);
      }

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
