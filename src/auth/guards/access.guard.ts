import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as C from '../../constants';

@Injectable()
export class AccessGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException(C.INVALID_OR_MISSING_ACCESS_TOKEN);
    }
    return user;
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const publicRoutes = [
      '/auth/signup',
      '/auth/login',
      '/auth/refresh',
      '/doc',
      '/',
      '/health'
    ];

    if (publicRoutes.includes(req.path)) {
      return true;
    }
    return super.canActivate(context);
  }
}
