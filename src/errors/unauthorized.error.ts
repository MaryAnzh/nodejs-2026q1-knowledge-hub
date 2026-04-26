import { BaseError } from './base.error';
import { StatusCodes as SC } from 'http-status-codes';
import * as C from '../constants';

export class UnauthorizedCustomError extends BaseError {
  constructor(message?: string) {
    super(message ?? C.UNAUTHORIZED, SC.UNAUTHORIZED);
  }
}
