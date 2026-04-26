import { BaseError } from './base.error';
import { StatusCodes as SC } from 'http-status-codes';
import * as C from '../constants';
import { capitalize } from '../utils/common';

export class NotFoundCustomError extends BaseError {
  constructor(message?: string) {
    super(
      `${message ? capitalize(message) : C.THE_RESOURCE} ${C.NOT_FOUND}`,
      SC.NOT_FOUND,
    ); // 404
  }
}
