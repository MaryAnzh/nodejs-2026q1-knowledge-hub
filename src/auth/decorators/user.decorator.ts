import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const userFactory = (_: unknown, ctx: ExecutionContext) =>
  ctx.switchToHttp().getRequest().user;

export const User = createParamDecorator(userFactory);
