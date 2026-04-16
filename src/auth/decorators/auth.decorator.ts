import { applyDecorators, UseGuards } from "@nestjs/common";
import { AccessGuard } from "../guards/access.guard";
import { RolesGuard } from "../guards/roles.guard";

export function Auth() {
  return applyDecorators(UseGuards(AccessGuard, RolesGuard));
}