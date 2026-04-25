import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import * as C from '../constants';

@Injectable()
export class ParseUUIDPipe implements PipeTransform {
  transform(value: string) {
    if (!isUUID(value)) {
      throw new BadRequestException(C.INVALID_UUID_FORMAt);
    }
    return value;
  }
}
