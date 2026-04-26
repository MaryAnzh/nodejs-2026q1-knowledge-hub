import { Controller, Get } from '@nestjs/common';
import * as C from '../constants';

@Controller(C.ROUTES.HEALTH)
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
