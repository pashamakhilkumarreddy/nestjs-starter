import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';
import { Response } from 'express';

export enum ResponseType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARN = 'warn'
}

export class ResponseObjDTO {
  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsObject()
  data: any;
}

export const ResponseObj = (
  status: ResponseType,
  message: string,
  data?: any
): ResponseObjDTO => ({ status, message, data: data || {} });

export const ApiSendResponse = (
  response: ResponseObjDTO,
  res: Response,
  successCode?: number,
  warn?: number,
  failCode?: number
) => {
  switch (response.status) {
    case ResponseType.SUCCESS:
      res.status(successCode || 201).send(response);
      break;
    case ResponseType.ERROR:
      res.status(failCode || 500).send(response);
      break;
    case ResponseType.WARN:
      res.status(warn || 404).send(response);
      break;
  }
};
