import { applyDecorators, UseGuards } from '@nestjs/common';
import { AccessGuard } from '../guards/access.guard';

export function Auth() {
  return applyDecorators(UseGuards(AccessGuard));
}