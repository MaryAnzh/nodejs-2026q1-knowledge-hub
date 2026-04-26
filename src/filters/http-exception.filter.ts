import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '../logger/logger.service';
import { StatusCodes as SC } from 'http-status-codes';
import * as C from '../constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  private mask(body: any) {
    if (!body || typeof body !== 'object') return body;

    const clone = { ...body };
    const sensitive = [C.PASSWORD, C.TOKEN, C.REFRESH_TOKEN];

    for (const key of sensitive) {
      if (clone[key]) clone[key] = '***';
    }

    return clone;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : SC.INTERNAL_SERVER_ERROR;

    const message =
      isHttp && (exception as any).details
        ? (exception as any).details
        : isHttp
          ? exception.message
          : C.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    this.logger.error(
      {
        method: request.method,
        url: request.url,
        body: this.mask(request.body),
        message,
      },
      'ERROR',
    );

    if (exception instanceof Error && exception.stack) {
      this.logger.error(exception.stack);
    }

    response.status(status).json(errorResponse);
  }
}
