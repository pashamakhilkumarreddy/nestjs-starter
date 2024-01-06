import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDTO {
  @ApiProperty({
    type: String,
    description: 'send username as a string',
    example: 'naruto@uzumaki.sak',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send username as a string'
  })
  username: string;

  @ApiProperty({
    type: String,
    description: 'send password as a string',
    example: '1U5a+LSJYSnp1+l4hqO1gQ==',
    required: true
  })
  @IsNotEmpty()
  @IsString({
    message: 'send password as a string'
  })
  password: string;
}
