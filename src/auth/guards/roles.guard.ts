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

    console.log('--- RolesGuard ---');
    console.log('Controller:', className);
    console.log('Method:', handler);
    console.log('requiredRoles:', requiredRoles);
    console.log('user:', user);

    // Если роли не требуются — пропускаем
    if (!requiredRoles) {
      console.log('→ No roles required → ALLOW');
      return true;
    }

    // Если нет user.role — пропускаем (GET или тестовый токен)
    if (!user?.role) {
      console.log('→ No user.role → ALLOW');
      return true;
    }

    // Если роль не подходит — запрещаем
    if (!requiredRoles.includes(user.role)) {
      console.log('→ Role mismatch → FORBIDDEN');
      throw new ForbiddenException('Insufficient permissions');
    }

    console.log('→ Role OK → ALLOW');
    return true;
  }
}