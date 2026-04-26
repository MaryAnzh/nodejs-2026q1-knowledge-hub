import { BaseError } from './base.error';
import { StatusCodes as SC } from 'http-status-codes';
import * as C from '../constants';
export type ValidationFieldError = {
  field: string;
  errors: string[];
};

export class ValidationCustomError extends BaseError {
  details?: ValidationFieldError[];

  constructor(messageOrDetails?: string | ValidationFieldError[]) {
    const message =
      typeof messageOrDetails === 'string'
        ? `${messageOrDetails}: ${C.VALIDATION_FAILED}`
        : C.VALIDATION_FAILED;

    super(message, SC.BAD_REQUEST);

    if (Array.isArray(messageOrDetails)) {
      this.details = messageOrDetails;
    }
  }
}
