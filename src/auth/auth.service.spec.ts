import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const userServiceMock = {
    create: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useFactory: () => userServiceMock },
        { provide: JwtService, useFactory: () => jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    const user = {
      id: 'foo',
      token: '',
      lastUpdate: null,
      save: jest.fn().mockResolvedValueOnce(true),
    };

    it('should pass correct params to dependencies', async () => {
      jwtServiceMock.sign.mockReturnValueOnce('foo');

      const result = await service.generateToken(user as any);

      expect(result).toBe(user);
      expect(jwtServiceMock.sign).toHaveBeenNthCalledWith(1, {
        userId: user.id,
      });
    });
  });

  describe('register', () => {
    const user = { password: 'foo', id: 'bar' };

    it('should pass correct params to dependencies', async () => {
      userServiceMock.create.mockResolvedValueOnce(user);
      jest
        .spyOn(service, 'generateToken')
        .mockImplementationOnce(data => data as any);

      const result = await service.register(user as any);

      expect(result).toEqual({ id: user.id });
      expect(userServiceMock.create).toHaveBeenNthCalledWith(1, user);
    });
  });

  describe('login', () => {
    const user = { password: 'foo', id: 'bar' };

    it('should pass correct params to dependencies', async () => {
      userServiceMock.findById.mockResolvedValueOnce(user);
      jest
        .spyOn(service, 'generateToken')
        .mockImplementationOnce(data => data as any);

      const result = await service.login(user.id);

      expect(result).toEqual(user);
      expect(userServiceMock.findById).toHaveBeenNthCalledWith(1, user.id);
    });
  });

  describe('validateUser', () => {
    const comparePassword = jest.fn().mockReturnValue(true);
    const user = { email: 'baz', password: 'foo', id: 'bar', comparePassword };

    it('should pass correct params to dependencies', async () => {
      userServiceMock.findByEmail.mockResolvedValueOnce(user);

      const result = await service.validateUser(user.email, user.password);

      expect(result).toEqual(user);
      expect(userServiceMock.findByEmail).toHaveBeenNthCalledWith(
        1,
        user.email,
      );
    });

    it('should throw error when email not found', async () => {
      userServiceMock.findByEmail.mockResolvedValueOnce(undefined);

      await expect(
        service.validateUser(user.email, user.password),
      ).rejects.toThrow(
        new HttpException({ message: 'Email not found' }, HttpStatus.NOT_FOUND),
      );
    });

    it('should throw error when password is incorrect', async () => {
      comparePassword.mockReturnValueOnce(false);
      userServiceMock.findByEmail.mockResolvedValueOnce(user);

      await expect(
        service.validateUser(user.email, user.password),
      ).rejects.toThrow(
        new HttpException(
          { message: 'Invalid password' },
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });
  });
});
