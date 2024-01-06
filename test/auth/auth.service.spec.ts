import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/auth.service';
import { AuthServiceMock } from './auth.service.mock';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceMock
        }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should login and return a token', async () => {
      const result = await authService.login({
        username: 'super_admin',
        password: 'saBxHqmV82AJYui0XzRtTQ'
      });

      expect(result).toBeDefined();
      expect(result.data.token).toContain('token');
      expect(result.status).toEqual('success');
    });

    it('should fail to login with invalid credentials', async () => {
      const result = await authService.login({
        username: 'johndoe',
        password: 'b/9LlZnBbZQTGzt6'
      });
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('Error logging in to Keycloak');
    });
  });
});
