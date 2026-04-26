import { BaseError } from './base.error';
import { StatusCodes as SC } from 'http-status-codes';
import * as C from '../constants';

export class ValidationCustomError extends BaseError {
  constructor(message?: string) {
    super(
      `${message ? `${message}:` : ''} ${C.VALIDATION_FAILED}`,
      SC.BAD_REQUEST,
    ); // 400
  }
}
