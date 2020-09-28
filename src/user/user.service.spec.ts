import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { User } from './user.entity';
import { Phone } from './phone.entity';

describe('UserService', () => {
  let service: UserService;
  const userRepositoryMock = {
    findOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const phoneRepositoryMock = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: () => userRepositoryMock,
        },
        {
          provide: getRepositoryToken(Phone),
          useFactory: () => phoneRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const data = {
      name: 'foo',
      id: 'id',
      phones: [{ ddd: 'bar', value: 'baz' }],
    };
    const expectedData = {
      ...data,
      phones: [{ ddd: 'bar', value: 'baz', userId: data.id }],
    };

    it('should pass correct params to dependencies', async () => {
      userRepositoryMock.create.mockReturnValueOnce(data);
      userRepositoryMock.save.mockResolvedValueOnce(true);
      phoneRepositoryMock.save.mockResolvedValueOnce(expectedData.phones);

      const result = await service.create(data as any);

      expect(result).toEqual(expectedData);
      expect(userRepositoryMock.create).toHaveBeenNthCalledWith(1, {
        name: 'foo',
        id: 'id',
      });
      expect(userRepositoryMock.save).toHaveBeenNthCalledWith(1, expectedData);
      expect(phoneRepositoryMock.save).toHaveBeenNthCalledWith(
        1,
        expectedData.phones,
      );
    });
  });

  describe('findByEmail', () => {
    const email = 'foo';

    it('should pass correct params to dependencies', async () => {
      userRepositoryMock.getOne.mockResolvedValueOnce(true);

      const result = await service.findByEmail(email);

      expect(result).toBeTruthy();
      expect(userRepositoryMock.createQueryBuilder).toHaveBeenNthCalledWith(
        1,
        'user',
      );
      expect(userRepositoryMock.addSelect).toHaveBeenNthCalledWith(
        1,
        'user.password',
      );
      expect(userRepositoryMock.where).toHaveBeenNthCalledWith(
        1,
        'user.email = :email',
        { email },
      );
      expect(userRepositoryMock.getOne).toHaveBeenNthCalledWith(1);
    });
  });

  describe('findById', () => {
    const userId = 'foo';

    it('should pass correct params to dependencies', async () => {
      userRepositoryMock.findOne.mockResolvedValueOnce(true);

      const result = await service.findById(userId);

      expect(result).toBeTruthy();
      expect(userRepositoryMock.findOne).toHaveBeenNthCalledWith(1, userId);
    });
  });
});
