import { BadRequestException } from '@nestjs/common';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  ArrayMaxSize,
  IsEmail,
  IsUUID,
  Matches,
  IsEnum,
  ArrayMinSize,
  MaxLength,
  IsIn
} from 'class-validator';
import { RoleTypes, UserStatus } from 'src/common/constants';
import { base64Image } from 'src/common/constants/image';
import {
  IsBase64,
  IsValidUser
} from 'src/common/decorators/dto-validators.decorators';
import { BasePaginationDto } from 'src/common/dtos';
import { isValidJson, transformJsonString } from 'src/common/utils';

export class KeyCloakUserDto {
  @ApiProperty({
    type: String,
    description: 'send sub as a string',
    example: '',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send sub as a string'
  })
  sub: string;

  @ApiProperty({
    type: String,
    description: 'send clientId as a string',
    example: 'default-client',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send clientId as a string'
  })
  clientId: string;

  @ApiProperty({
    type: String,
    description: 'send email_verified as a boolean',
    example: true,
    required: true
  })
  @IsNotEmpty()
  @IsBoolean({
    message: 'send email_verified as a boolean'
  })
  email_verified: boolean;

  @ApiProperty({
    type: String,
    description: 'send name as a string',
    example: 'Naruto',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send name as a string'
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'send preferred_username as a string',
    example: 'naruto_hinata',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send preferred_username as a string'
  })
  preferred_username: string;

  @ApiProperty({
    type: String,
    description: 'send given_name as a string',
    example: 'Nar',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send given_name as a string'
  })
  given_name: string;

  @ApiProperty({
    type: String,
    description: 'send userId as a string',
    example: '123e4567-e89b-12d3-a456-426655440000',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send userId as a string'
  })
  userId: string;

  @ApiProperty({
    type: String,
    description: 'send family_name as a string',
    example: 'uzumaki',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send family_name as a string'
  })
  family_name: string;

  @ApiProperty({
    type: String,
    description: 'send email as a string',
    example: 'naruto@uzumaki.com',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send email as a string'
  })
  email: string;
}

export class Role {
  @IsString()
  @IsNotEmpty()
  name: RoleTypes;
}

export class AddUserDTO {
  @ApiProperty({
    type: String,
    description: 'send image as a string',
    example: base64Image,
    required: false
  })
  @IsOptional()
  @IsString({
    message: 'send image as a string'
  })
  image?: string;

  @ApiProperty({
    type: String,
    description: 'send title as a string',
    example: 'CEO',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send title as a string'
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'send firstName as a string',
    example: 'Naruto',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send firstName as a string'
  })
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'send lastName as a string',
    example: 'Uzumaki',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send lastName as a string'
  })
  lastName: string;

  @ApiProperty({
    type: String,
    description: 'send email as a string',
    example: 'naruto@uzumaki.com',
    required: true
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString({
    message: 'send email as a string'
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'send countryCode as a string',
    example: '1',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send countryCode as a string'
  })
  countryCode: string;

  @ApiProperty({
    type: String,
    description: 'send phone as a string',
    example: '9966122233',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send phone as a string'
  })
  @MaxLength(15, {
    message: 'Phone Number cannot exceed 10 digits'
  })
  @Matches(/^[0-9]+$/, {
    message: 'Phone Number should include only numbers'
  })
  phone: string;

  @ApiProperty({
    isArray: true,
    type: String,
    example: JSON.stringify(Object.values(RoleTypes)),
    description: 'send data in json array eg : [{name: "admin"}]',
    required: true
  })
  @IsNotEmpty()
  @Transform(({ value, ...data }) => {
    if (Array.isArray(value) && value.length) {
      return value;
    } else if (isValidJson(value)) {
      return JSON.parse(value);
    }
    throw new BadRequestException(`invalid ${data.key}`);
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @Type(() => Role)
  @ValidateNested({ each: true })
  roles: Role[];

  createdBy: string;

  modifiedBy: string;
}

export class UpdateUserDTO {
  @ApiProperty({
    type: String,
    description: 'send image as a string',
    example: base64Image,
    required: false
  })
  @IsOptional()
  @IsString({
    message: 'send image as a string'
  })
  @IsBase64({
    message: 'send logo in base64 format'
  })
  image?: string;

  @ApiProperty({
    type: String,
    description: 'send title as a string',
    example: 'CFO',
    required: false
  })
  @IsOptional()
  @IsString({
    message: 'send title as a string'
  })
  title?: string;

  @ApiProperty({
    type: String,
    description: 'send firstName as a string',
    example: 'Hinata',
    required: false
  })
  @IsOptional()
  @IsString({
    message: 'send firstName as a string'
  })
  firstName?: string;

  @ApiProperty({
    type: String,
    description: 'send lastName as a string',
    example: 'Uzumaki',
    required: false
  })
  @IsOptional()
  @IsString({
    message: 'send lastName as a string'
  })
  lastName?: string;

  @ApiProperty({
    type: String,
    description: 'send email as a string',
    example: 'hinata@uzumaki.com',
    required: false
  })
  @IsOptional()
  @IsEmail()
  @IsString({
    message: 'send email as a string'
  })
  email?: string;

  @ApiProperty({
    type: String,
    description: 'send countryCode as a string',
    example: '1',
    required: false
  })
  @IsOptional()
  @IsString({
    message: 'send countryCode as a string'
  })
  countryCode?: string;

  @ApiProperty({
    type: String,
    description: 'send phone as a string',
    example: '8710373754',
    required: false
  })
  @IsOptional()
  @IsString({
    message: 'send phone as a string'
  })
  @MaxLength(15, {
    message: 'Phone Number cannot exceed 10 digits'
  })
  @Matches(/^[0-9]+$/, {
    message: 'Phone Number should include only numbers'
  })
  phone?: string;

  @ApiProperty({
    isArray: true,
    type: String,
    example: JSON.stringify(Object.values(RoleTypes)),
    description:
      'send data in json array eg : [{id: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6", name: "user"}]',
    required: false
  })
  @IsOptional()
  @Transform(({ value, ...data }) => {
    if (Array.isArray(value)) {
      return value;
    } else if (isValidJson(value)) {
      return JSON.parse(value);
    }
    throw new BadRequestException(`invalid ${data.key}`);
  })
  @IsArray()
  @Type(() => Role)
  @ValidateNested({ each: true })
  @ArrayMaxSize(1)
  roles?: Role[];

  @ApiProperty({
    type: String,
    description: 'send status as a string',
    example: UserStatus.ACTIVE,
    required: false
  })
  @IsOptional()
  @IsString({
    message: 'send status as a string'
  })
  @Transform(({ value }) => value.toLocaleLowerCase())
  @IsEnum(UserStatus, {
    message: `status must be one of ${Object.values(UserStatus)}`
  })
  status?: string;

  @ApiProperty({
    type: Boolean,
    description: 'send emailVerified as a boolean',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean({
    message: 'send emailVerified as a boolean'
  })
  emailVerified?: boolean;

  modifiedBy: string;
}

export class UpdateUserPasswordDTO {
  @ApiProperty({
    type: String,
    description: 'send password as a string',
    example: 'ybRt6G3DZSsoz7fUJlvmag',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send password as a string'
  })
  password: string;
}

export enum sortTypes {
  name = 'name',
  role = 'role',
  title = 'title'
}

export class BaseUserDto {
  @ApiProperty({
    type: String,
    description: 'send data in json array eg : [value,value]',
    example: [sortTypes.name, sortTypes.role],
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => {
    return transformJsonString(value);
  })
  @IsArray({ message: 'sortTypes must be an array' })
  @IsString({
    each: true,
    message: 'Each element of sortTypes must be a string'
  })
  @IsIn(Object.values(sortTypes), {
    each: true,
    message: 'Invalid sortTypes value'
  })
  sortTypes?: sortTypes[];

  @ApiProperty({
    type: String,
    description: 'send data in json array eg : [value,value]',
    example: ['hinata', 'sasuke'],
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => {
    return transformJsonString(value);
  })
  @IsArray({ message: 'name must be an array' })
  @IsString({
    each: true,
    message: 'Each element of name must be a string'
  })
  name?: string[];

  @ApiProperty({
    type: String,
    description: 'send data in json array eg : [value,value]',
    example: [RoleTypes.SUPER_ADMIN, RoleTypes.ADMIN],
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => {
    return transformJsonString(value);
  })
  @IsArray({ message: 'role must be an array' })
  @IsString({
    each: true,
    message: 'Each element of role must be a string'
  })
  @IsIn(Object.values(RoleTypes), {
    each: true,
    message: 'Invalid role value'
  })
  role?: RoleTypes[];

  @ApiProperty({
    type: String,
    description: 'send data in json array eg : [value,value]',
    example: ['ceo', 'coo'],
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => {
    return transformJsonString(value);
  })
  @IsArray({ message: 'title must be an array' })
  @IsString({
    each: true,
    message: 'Each element of title must be a string'
  })
  title?: string[];
}

export class PaginatedUserDto extends IntersectionType(
  BaseUserDto,
  BasePaginationDto
) {}

export class PaginatedUserNotificationsDto extends BasePaginationDto {
  @ApiProperty({
    type: Boolean,
    description: 'send read as a boolean',
    example: true,
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => {
    return Boolean(value);
  })
  @IsBoolean({ message: 'Invalid read input' })
  read?: boolean;
}

export class UserIdParam {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  @IsValidUser()
  userId: string;
}
