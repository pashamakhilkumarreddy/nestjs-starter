import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { Public, Roles } from 'src/common/decorators';
import { RoleTypes } from 'src/common/constants';
import { AuthService } from './auth.service';
import { UserLoginDTO } from './dtos/auth.dto';
import { UserIdParam } from '../users/dtos/users.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: 'Used by : Users to login',
    description:
      'The Goal of the API is to provide the route for the Users to login.'
  })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UserLoginDTO })
  @Post('/login')
  login(@Body() body: UserLoginDTO): Promise<any> {
    return this.authService.login(body);
  }

  @ApiOperation({
    summary: 'Used by: Admin/Users to send update password email',
    description:
      'The Goal of the API is to provide the route for the Admin/Users to send update password email'
  })
  @ApiParam({
    name: 'userId',
    description: 'User Id',
    required: true
  })
  @ApiBearerAuth()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleTypes.SUPER_ADMIN)
  @Put('/:userId/update-password-email')
  sendUpdatePasswordEmail(
    @Req() req: any,
    @Param() params: UserIdParam
  ): Promise<any> {
    return this.authService.sendUpdatePasswordEmail(req, params);
  }
}
