import { promises as fs } from 'fs'; import * as path from 'path';
import { Logger, LogLevel } from '@nestjs/common';

import * as C from '../constants';
import { LogLevelType, LoggerFormatType } from '../types/logs';

export class AppLogger extends Logger {
  private readonly isDev = process.env.NODE_ENV === 'development';
  private logFilePath = path.join(process.cwd(), `${C.APP}.${C.LOG}`);
  // KB → bytes
  private maxSize = Number(process.env.LOG_MAX_FILE_SIZE ?? 1024) * 1024;

  private async rotateFile() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rotatedName = `${C.APP}-${timestamp}.${C.LOG}`;
    const rotatedPath = path.join(process.cwd(), rotatedName);

    try {
      await fs.rename(this.logFilePath, rotatedPath);
    } catch (err) {
      super.error(C.FAILED_TO_ROTATE, err as Error);
    }
  }

  private format(level: LogLevelType, message: unknown, context?: string): LoggerFormatType {
    const timestamp = new Date().toISOString();

    const msg =
      typeof message === 'string'
        ? message
        : JSON.stringify(message);


    const json = JSON.stringify({
      timestamp,
      level,
      context,
      message: msg,
    });

    return (
      {
        line: `[${timestamp}] [${level.toUpperCase()}]${context ? `[${context}]` : C.NO_CONTEXT} ${msg}`,
        json
      });
  }

  private async checkFileSize() {
    try {
      try {
        await fs.access(this.logFilePath);
      } catch {
        return;
      }

      const stats = await fs.stat(this.logFilePath);

      if (stats.size >= this.maxSize) {
        await this.rotateFile();
      }
    } catch (err) {
      super.error(C.FAILED_TO_CHECK_LOG_FILE, err as Error);
    }
  }

  private async writeToFile(message: string) {
    try {
      await fs.appendFile(this.logFilePath, message + '\n', { encoding: 'utf8' });
      await this.checkFileSize();
    } catch (err) {
      super.error(C.FAILED_TO_WRIT_LOG_FILE, err);
    }
  }

  private show(level: LogLevelType, message: unknown, context?: string) {
    const { line, json } = this.format(level, message, context);

    if (this.isDev) {
      console.log(line);
    }

    this.writeToFile(json);
  }

  constructor(context?: string) {
    super(context);
  }

  log(message: unknown, context?: string) {
    this.show(C.LOG, message, context);
  }

  error(message: unknown, trace?: string, context?: string) {
    this.show(C.ERROR, { message, trace }, context);
  }

  warn(message: unknown, context?: string) {
    this.show(C.WARN, message, context);
  }

  debug(message: unknown, context?: string) {
    this.show(C.DEBUG, message, context);
  }

  verbose(message: unknown, context?: string) {
    this.show(C.VERBOSE, message, context);
  }
}
