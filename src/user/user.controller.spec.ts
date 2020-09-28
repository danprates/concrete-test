import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  const userServiceMock = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useFactory: () => userServiceMock }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findById', () => {
    let userId = 'foo';
    const req = { user: { userId: 'foo' } };

    it('should pass correct params to dependencies', async () => {
      userServiceMock.findById.mockResolvedValueOnce(true);

      const result = await controller.findById(userId, req);

      expect(result).toBeTruthy();
      expect(userServiceMock.findById).toHaveBeenNthCalledWith(1, userId);
    });

    it('should throw error when userId were diferent from req.user.userId', async () => {
      userId = 'bar';

      await expect(controller.findById(userId, req)).rejects.toThrowError(
        new HttpException({ message: 'Unauthorized' }, HttpStatus.UNAUTHORIZED),
      );
    });
  });
});
