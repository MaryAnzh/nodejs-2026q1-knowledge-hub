import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppLogger } from './logger.service';
import * as C from '../constants';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
    constructor(private readonly logger: AppLogger) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const { method, url, body } = request;

        const start = Date.now();

        const safeBody = this.mask(body);

        this.logger.log(
            {
                method,
                url,
                body: safeBody,
                message: C.INCOMING_REQUEST,
            },
            'HTTP',
        );

        return next.handle().pipe(
            tap((responseBody) => {
                const duration = Date.now() - start;

                this.logger.log(
                    {
                        method,
                        url,
                        duration,
                        message: C.OUTGOING_RESPONSE,
                    },
                    'HTTP',
                );
            }),
        );
    }

    private mask(body: any) {
        if (!body || typeof body !== 'object') return body;

        const clone = { ...body };

        const sensitive = [C.PASSWORD, C.TOKEN, C.REFRESH_TOKEN];

        for (const key of sensitive) {
            if (clone[key]) clone[key] = '***';
        }

        return clone;
    }
}