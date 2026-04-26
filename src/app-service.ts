import { Injectable } from '@nestjs/common';

import { HELLO } from './constants';

@Injectable()
export class AppService {
  getHello() {
    return HELLO;
  }
}
