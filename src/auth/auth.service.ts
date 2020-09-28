import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignupDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(user: User): Promise<User> {
    const token = this.jwtService.sign({ userId: user.id });

    user.token = token;
    user.lastLogin = new Date();

    await user.save();
    return user;
  }

  async register(data: SignupDto): Promise<User> {
    const user = await this.userService.create(data);

    delete user.password;

    return this.generateToken(user);
  }

  async login({ id }: any): Promise<User> {
    const user = await this.userService.findById(id);

    return this.generateToken(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException(
        { message: 'Email not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.comparePassword(password)) {
      throw new HttpException(
        { message: 'Invalid password' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete user.password;

    return user;
  }
}
