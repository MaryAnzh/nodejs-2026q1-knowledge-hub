import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(ctx: ExecutionContext): boolean {
    const className = ctx.getClass().name;
    const handler = ctx.getHandler().name;

    const requiredRoles = this.reflector.get<Role[]>('roles', ctx.getHandler());
    const { user } = ctx.switchToHttp().getRequest();

    if (!requiredRoles) {
      return true;
    }

    if (!user?.role) {
      return true;
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
