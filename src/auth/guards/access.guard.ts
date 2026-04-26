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
    const req = context.switchToHttp().getRequest();

    if (C.PUBLIC_ROUTES.includes(req.path ?? req.url)) {
      return true;
    }
    return super.canActivate(context);
  }
}
