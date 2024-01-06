import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthServiceMock {
  login = jest.fn().mockImplementation(async (body: any) => {
    if (body.username === 'super_admin' && body.password === 'saBxHqmV82AJYui0XzRtTQ') {
      return {
        status: 'success',
        data: {
          token: 'token'
        }
      };
    } else {
      return new HttpException(
        {
          status: 'error',
          message: 'Error logging in to Keycloak'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  });
}
