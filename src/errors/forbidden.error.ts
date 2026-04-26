import { BaseError } from './base.error';
import { StatusCodes as SC } from 'http-status-codes';
import * as C from '../constants';

export class ForbiddenCustomError extends BaseError {
  constructor(message?: string) {
    super(message ?? C.FORBIDDEN, SC.FORBIDDEN); // 403
  }
}
