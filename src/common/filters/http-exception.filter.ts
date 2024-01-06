import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { UniqueConstraintError, ValidationError } from 'sequelize';

@Catch()
export class GlobalHttpExceptionFilter
  implements ExceptionFilter<HttpException>
{
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException | unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    // const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      errors = this.formatErrorResponse(exception.getResponse());
      delete errors.statusCode;
    }

    let responseBody: any = {
      status,
      path: httpAdapter.getRequestUrl(request),
      message,
      timestamp: new Date().toISOString()
    };

    if (typeof errors === 'string') {
      responseBody.errors = [errors];
    } else {
      responseBody = {
        ...responseBody,
        ...errors
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }

  private formatErrorResponse(errorResp: any) {
    if (errorResp.error instanceof ValidationError) {
      // Handle validation errors
      const validationErrors = errorResp.error.errors.map(
        (err: any) => err.message
      );
      return {
        errors: validationErrors
      };
    } else if (errorResp.error instanceof UniqueConstraintError) {
      // Handle unique constraint violations
      return errorResp;
    } else if (errorResp.error && errorResp.error.message) {
      return {
        errors: [errorResp.error.message]
      };
    } else if (
      errorResp.error &&
      errorResp.message &&
      Array.isArray(errorResp.message)
    ) {
      return {
        errors: errorResp.message
      };
    } else {
      // For any other error types, return the original error
      return errorResp;
    }
  }
}
