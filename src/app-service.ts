import { Injectable } from '@nestjs/common';
import { HELLO } from 'src/constants';

@Injectable()
export class AppService {
    getHello() {
        return HELLO;
    }
}
