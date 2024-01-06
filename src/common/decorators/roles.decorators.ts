import { SetMetadata } from '@nestjs/common';
import { RoleTypes, ROLES_KEY } from '../constants';

export const Roles = (...roles: RoleTypes[]) => SetMetadata(ROLES_KEY, roles);
