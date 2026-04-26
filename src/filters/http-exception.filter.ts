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

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : SC.INTERNAL_SERVER_ERROR;

    const message = isHttp ? exception.message : C.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    // 1) Короткий JSON‑лог ошибки
    this.logger.error(
      {
        method: request.method,
        url: request.url,
        body: request.body,
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
