import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { RoleTypes } from 'src/common/constants';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY, KeyCloakUserObject } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Determines whether the request should be processed based on authentication and authorization.
   * @param context - The execution context.
   * @returns A boolean indicating whether the request should be processed.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()]
      );
      if (isPublic) return true;
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('Bearer Token Missing');
      }
      const keycloakHost = this.configService.get('KEYCLOAK_BASE_URL');
      const keycloakRealmName = this.configService.get('KEYCLOAK_REALM_NAME');

      const keycloakBaseURL = `${keycloakHost}/realms/${keycloakRealmName}/protocol/openid-connect/userinfo`;

      const userResponse = await fetch(keycloakBaseURL, {
        headers: {
          accept: 'application/json',
          authorization: request.header('authorization')
        },
        method: 'GET'
      });

      if (!userResponse.ok) {
        throw new HttpException(
          userResponse.statusText || 'Session has expired',
          userResponse.status || HttpStatus.UNAUTHORIZED
        );
      }
      const userObject: KeyCloakUserObject = await userResponse.json();
      const isAdmin = userObject.roles.includes(RoleTypes.SUPER_ADMIN);
      userObject.isAdmin = isAdmin;
      response.locals.user = userObject;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnauthorizedException({
        statusCode: 401,
        type: 'OAuthException',
        message: 'Invalid Token'
      });
    }
    return true;
  }

  /**
   * Verifies a JWT token using the provided token string.
   *
   * @param {string} token - The JWT token to be verified.
   *
   * @returns {Promise<any>} - A Promise resolving to the decoded token payload if verification is successful.
   * @throws {Error} - Throws an error with the message 'Invalid token' if verification fails.
   */
  async verifyJwtToken(token: string): Promise<any> {
    try {
      // Attempt to verify the JWT token using the JwtService
      const decoded = await this.jwtService.verify(token);

      // Return the decoded token payload if verification is successful
      return decoded;
    } catch (error) {
      // Handle token verification error by throwing a new Error with a descriptive message
      throw new Error('Invalid token');
    }
  }

  /**
   * Extracts the token from the request header.
   * @param request - The incoming request object.
   * @returns The token extracted from the header, or undefined if not found.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
