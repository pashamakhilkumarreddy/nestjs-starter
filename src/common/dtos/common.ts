import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsArray,
  IsIn
} from 'class-validator';
import { SortByTypes } from '../constants';
import { transformJsonString } from '../utils';

export class BasePaginationDto {
  @ApiProperty({
    type: Number,
    description: 'send page as a number',
    example: 1,
    required: true
  })
  @IsNotEmpty({ message: 'page is required' })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'page must be an integer number' })
  @Min(1, { message: 'page must not be less than 1' })
  page: number;

  @ApiProperty({
    type: Number,
    description: 'send limit as a string',
    example: 5,
    required: true
  })
  @IsNotEmpty({ message: 'limit is required' })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'limit must be an integer number' })
  @Min(1, { message: 'limit must not be less than 1' })
  limit: number;

  @ApiProperty({
    type: String,
    description: 'Array of sorting criteria',
    example: [SortByTypes.ASC, SortByTypes.DESC],
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => {
    return transformJsonString(value);
  })
  @IsArray({ message: 'sortBy must be an array' })
  @IsString({ each: true, message: 'Each element of sortBy must be a string' })
  @IsIn(Object.values(SortByTypes), {
    each: true,
    message: 'Invalid sortBy value'
  })
  sortBy?: SortByTypes[];
}
