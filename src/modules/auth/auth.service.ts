import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { KeyCloakService } from 'src/common/services';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entities';
import { UserLoginDTO } from './dtos/auth.dto';
import { UserIdParam } from '../users/dtos/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly keyCloakService: KeyCloakService,
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {}

  /**
   * Login method for authenticating a user.
   *
   * @param {UserLoginDTO} body - User login data, including username and password.
   * @returns {Promise<any>} - Authentication response.
   *
   */
  async login(body: UserLoginDTO): Promise<any> {
    try {
      const { username, password } = body;

      const authResponse = await this.keyCloakService.login({
        username,
        password
      });

      return {
        status: 'success',
        data: authResponse
      };
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: 'error',
          message: err.message || 'Error logging in to Keycloak',
          error: err.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Asynchronously sends an update password email using the Keycloak service.
   *
   * @param req - The request object containing headers, including authorization token.
   * @param params - The request parameters containing the user ID for whom the password email is sent.
   *
   * @returns A Promise resolving to an object with status indicating success.
   *
   * @throws HttpException if there is an error during the process.
   */
  async sendUpdatePasswordEmail(req: any, params: UserIdParam): Promise<any> {
    try {
      // Extract the authorization token from the request headers.
      const authToken = req.headers.authorization;

      // Extract the user ID from the request parameters.
      const { userId } = params;

      const user = await this.userModel.findByPk(userId, {
        attributes: ['keycloakId'],
        raw: true
      });

      const { keycloakId } = user;

      const userInfo = await this.keyCloakService.fetchKeycloakUser({
        bearerToken: authToken,
        keycloakUserId: keycloakId
      });

      if (userInfo.emailVerified) {
        throw new BadRequestException('Email is already verified');
      }

      await this.keyCloakService.sendUpdatePasswordMail({
        bearerToken: authToken,
        keycloakUserId: keycloakId
      });

      return {
        status: 'success'
      };
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: 'error',
          message: err.message || 'Error sending reset password email',
          error: err.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
