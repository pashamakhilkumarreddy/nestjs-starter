import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { CreatorDetailsInterceptor } from 'src/common/interceptors';
import { MasterRole, Role } from 'src/entities';
import { Roles } from 'src/common/decorators';
import { RoleTypes } from 'src/common/constants';
import { RolesService } from './roles.service';
import { AddRoleDTO, RoleIdParam } from './dtos/roles.dto';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({
    summary: 'Used by : Super Admin to add a role',
    description:
      'The Goal of the API is to provide the route for the Super Admin to add a role.'
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: MasterRole })
  @ApiBody({ type: AddRoleDTO })
  @Post('/')
  @Roles(RoleTypes.SUPER_ADMIN)
  @UseInterceptors(CreatorDetailsInterceptor)
  addNewRole(@Req() req: any, @Body() body: AddRoleDTO): Promise<any> {
    return this.rolesService.create(req, body);
  }

  @ApiOperation({
    summary: 'Used by : Super Admin/Admin to fetch role details',
    description:
      'The Goal of the API is to provide the route for the Super Admin/Admin to fetch role details'
  })
  @ApiParam({
    name: 'id',
    description: 'Role Id',
    required: true
  })
  @Get(':id')
  @Roles(RoleTypes.SUPER_ADMIN, RoleTypes.ADMIN)
  async getRole(@Param() params: RoleIdParam): Promise<Role> {
    return this.rolesService.find(params.id);
  }

  @ApiOperation({
    summary: 'Used by : Super Admin/Admin to fetch all roles',
    description:
      'The Goal of the API is to provide the route for the Super Admin/Admin to fetch all roles'
  })
  @Get('/')
  @Roles(RoleTypes.SUPER_ADMIN, RoleTypes.ADMIN)
  getRoles(): Promise<any> {
    return this.rolesService.findAll();
  }

  @ApiOperation({
    summary: 'Used by : Super Admin to delete a role.',
    description:
      'The Goal of the API is to provide the route for the Super Admin to delete a role.'
  })
  @ApiParam({
    name: 'id',
    description: 'Role Id',
    required: true
  })
  @Delete(':id')
  @Roles(RoleTypes.SUPER_ADMIN)
  deleteRole(@Param() params: RoleIdParam) {
    return this.rolesService.delete(params.id);
  }
}
