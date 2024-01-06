import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { Response } from 'express';
import { CreatorDetailsInterceptor } from 'src/common/interceptors';
import { Roles } from 'src/common/decorators';
import { RoleTypes } from 'src/common/constants';
import {
  AddUserDTO,
  UpdateUserDTO,
  PaginatedUserDto,
  UserIdParam,
  UpdateUserPasswordDTO
} from './dtos/users.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Used by : Super Admin to add a new user',
    description:
      'The Goal of the API is to provide the route for the Super Admin to add a new user.'
  })
  @Post('/')
  @ApiBody({ type: AddUserDTO })
  @UseInterceptors(CreatorDetailsInterceptor)
  @Roles(RoleTypes.SUPER_ADMIN)
  create(@Req() req: any, @Body() body: AddUserDTO): Promise<any> {
    return this.usersService.create(req, body);
  }

  @ApiOperation({
    summary: 'Used by : Super Admin/Admin, User to update user details',
    description:
      'The Goal of the API is to provide the route for the Super Admin/Admin, User to update user details.'
  })
  @ApiParam({
    name: 'userId',
    description: 'User Id',
    required: true
  })
  @Put('/:userId')
  @ApiBody({ type: UpdateUserDTO })
  @UseInterceptors(CreatorDetailsInterceptor)
  @Roles(RoleTypes.SUPER_ADMIN, RoleTypes.ADMIN, RoleTypes.USER)
  update(
    @Req() req: any,
    @Res({
      passthrough: true
    })
    res: Response,
    @Param() params: UserIdParam,
    @Body() body: UpdateUserDTO
  ): Promise<any> {
    const user = res.locals.user;
    return this.usersService.update(req, user, params, body);
  }

  @ApiOperation({
    summary: 'Used by : Super Admin/Admin, User to update user password',
    description:
      'The Goal of the API is to provide the route for the Super Admin/Admin, User to update user password.'
  })
  @ApiParam({
    name: 'userId',
    description: 'User Id',
    required: true
  })
  @Put('/:userId/reset-password')
  @ApiBody({ type: UpdateUserPasswordDTO })
  @Roles(RoleTypes.SUPER_ADMIN, RoleTypes.ADMIN, RoleTypes.USER)
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  updatePassword(
    @Res({
      passthrough: true
    })
    res: Response,
    @Param() params: UserIdParam,
    @Body() body: UpdateUserPasswordDTO
  ): Promise<any> {
    const user = res.locals.user;
    return this.usersService.updatePassword(params, body, user);
  }

  @ApiOperation({
    summary: 'Used by : Super Admin/Admin to find user details',
    description:
      'The Goal of the API is to provide the route for the Super Admin/Admin to find user details.'
  })
  @ApiParam({
    name: 'userId',
    description: 'User Id',
    required: true
  })
  @Get(':userId')
  @Roles(RoleTypes.SUPER_ADMIN, RoleTypes.ADMIN, RoleTypes.USER)
  async find(@Param() params: UserIdParam): Promise<any> {
    return this.usersService.find(params.userId);
  }

  @ApiOperation({
    summary: 'Used by : Super Admin/Admin to fetch all users',
    description:
      'The Goal of the API is to provide the route for the Super Admin/Admin to fetch all users.'
  })
  @Get('/')
  @ApiOkResponse()
  @Roles(RoleTypes.SUPER_ADMIN, RoleTypes.ADMIN)
  findAll(@Query() query: PaginatedUserDto) {
    return this.usersService.findAll(query);
  }

  @ApiOperation({
    summary: 'Used by : Super Admin to delete a user',
    description:
      'The Goal of the API is to provide the route for the Super Admin to delete a user.'
  })
  @ApiParam({
    name: 'userId',
    description: 'User Id',
    required: true
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleTypes.SUPER_ADMIN)
  @Delete(':userId')
  async delete(@Req() req: any, @Param() params: UserIdParam): Promise<any> {
    return this.usersService.deleteUser(req, params.userId);
  }
}
