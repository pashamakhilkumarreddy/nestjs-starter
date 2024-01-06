import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleTypes, ROLES_KEY, KeyCloakUserObject } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines whether the request should be processed based on role-based authorization.
   * @param context - The execution context.
   * @returns A boolean indicating whether the request should be processed.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleTypes[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) {
      return true;
    }
    const response = context.switchToHttp().getResponse();
    const user = response.locals.user as KeyCloakUserObject;
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
