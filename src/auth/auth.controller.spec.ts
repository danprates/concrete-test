import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authServiceMock = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useFactory: () => authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should pass correct params to dependencies', async () => {
      authServiceMock.register.mockResolvedValueOnce(true);
      const data = { name: 'foo', email: 'bar', password: '123456' };

      const result = await controller.register(data);

      expect(result).toBeTruthy();
      expect(authServiceMock.register).toHaveBeenNthCalledWith(1, data);
    });
  });

  describe('login', () => {
    it('should pass correct params to dependencies', async () => {
      authServiceMock.login.mockResolvedValueOnce(true);
      const req = { user: { userId: 'foo' } };

      const result = await controller.login(req);

      expect(result).toBeTruthy();
      expect(authServiceMock.login).toHaveBeenNthCalledWith(1, req.user);
    });
  });
});
