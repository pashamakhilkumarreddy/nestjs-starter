import { ExecutionContext } from '@nestjs/common';

export class MockAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const response = context.switchToHttp().getResponse();

    // Mock user data as per your requirements
    const mockUser = {
      sub: '9876543210',
      email_verified: false,
      name: 'Sample User',
      preferred_username: 'sample_user',
      given_name: 'Sample',
      family_name: 'User',
      email: 'sample.user@example.com',
      userId: 'sampleUser123',
      roles: ['admin']
    };

    response.locals.user = mockUser;

    return true;
  }
}
