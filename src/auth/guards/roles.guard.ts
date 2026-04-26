import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ForbiddenCustomError } from '../../errors';

// export in Auth() decorator
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>('roles', ctx.getHandler());
    const { user } = ctx.switchToHttp().getRequest();

    if (!requiredRoles) {
      return true;
    }

    if (!user?.role) {
      throw new ForbiddenCustomError();
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenCustomError();
    }

    return true;
  }
}
