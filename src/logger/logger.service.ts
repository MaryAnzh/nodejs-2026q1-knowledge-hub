import { Logger, LogLevel } from '@nestjs/common';

export class AppLogger extends Logger {
  private logLevel: LogLevel;

  constructor(context?: string) {
    super(context);
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) ?? 'log';
  }

  log(message: any, context?: string) {
    super.log(message, context);
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
  }
}
