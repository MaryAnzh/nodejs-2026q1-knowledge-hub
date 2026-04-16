import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    console.log('--- AccessGuard.handleRequest ---');
    console.log('err:', err);
    console.log('user:', user);
    if (err || !user) {
      console.log('→ THROW UnauthorizedException');
      throw new UnauthorizedException('Invalid or missing access token');
    }
    console.log('→ PROTECTED ROUTE → CHECK JWT');
    return user;
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const publicRoutes = ['/auth/signup', '/auth/login', '/auth/refresh', '/doc', '/', '/health'];
    console.log('--- AccessGuard.canActivate ---');
    console.log('path:', req.path);
    console.log('Authorization:', req.headers.authorization);
    if (publicRoutes.includes(req.path)) {
      console.log('→ PUBLIC ROUTE → ALLOW');
      return true;
    }
    console.log('→ PROTECTED ROUTE → CHECK JWT');
    return super.canActivate(context);
  }
}
