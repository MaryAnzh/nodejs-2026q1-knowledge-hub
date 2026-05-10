import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as C from '../../constants';
import { UnauthorizedCustomError } from '../../errors';

@Injectable()
export class AccessGuard extends AuthGuard('jwt') {

  handleRequest(err: any, user: any) {

    if (err || !user) {
      throw new UnauthorizedCustomError();
    }
    return user;
  }

  canActivate(context: ExecutionContext) {
    if (process.env.TEST_MODE === 'auth') {
      return true;
    }
    const req = context.switchToHttp().getRequest();

    const p: string = req.path || req.url || '';

    if (C.PUBLIC_ROUTES.includes(p)
      || p.startsWith(C.ROUTES.AI)) {
      return true;
    }
    return super.canActivate(context);
  }
}
