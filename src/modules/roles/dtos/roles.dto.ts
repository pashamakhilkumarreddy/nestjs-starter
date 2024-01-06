import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { RoleTypes } from 'src/common/constants';

export class AddRoleDTO {
  @ApiProperty({
    type: String,
    description: 'send name as a string',
    example: RoleTypes.SUPER_ADMIN,
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send name as a string'
  })
  @Transform(({ value }) => value.toLocaleLowerCase())
  @IsEnum(RoleTypes, {
    message: `type must be one of ${Object.values(RoleTypes)}`
  })
  name: RoleTypes;

  createdBy: string;

  modifiedBy: string;
}

export class RoleIdParam {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  id: string;
}
