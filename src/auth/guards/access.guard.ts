import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or missing access token');
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
      '/health',
      '/auth/logout',
    ];

    if (publicRoutes.includes(req.path)) {
      return true;
    }
    return super.canActivate(context);
  }
}
