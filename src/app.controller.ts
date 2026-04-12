import { Controller, Get } from '@nestjs/common';
import { AppService } from './app-service';

@Controller()
export class AppController {
  constructor(private service: AppService) {}
  @Get()
  getRoot() {
    return this.service.getHello();
  }
}
