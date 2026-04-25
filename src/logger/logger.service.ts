import { promises as fs } from 'fs';
import * as path from 'path';
import { ConsoleLogger } from '@nestjs/common';

import * as C from '../constants';
import { LogLevelType, LoggerFormatType } from '../types/logs';

export class AppLogger extends ConsoleLogger {
  private readonly isDev = process.env.NODE_ENV === 'development';

  private logDir = path.join(process.cwd(), 'logs');
  private logFilePath = path.join(this.logDir, `${C.APP}.${C.LOG}`); // app.log

  // KB → bytes
  private maxSize = Number(process.env.LOG_MAX_FILE_SIZE ?? 1024) * 1024;

  constructor(context?: string) {
    super(context);
  }

  private async ensureLogDirAndFile() {
    const exists = await fs
      .access(this.logDir)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      await fs.mkdir(this.logDir, { recursive: true });
    }

    const fileExists = await fs
      .access(this.logFilePath)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      await fs.writeFile(this.logFilePath, '', { encoding: 'utf8' });
    }
  }

  private async rotateFile() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    // app-2025-06-15T10-30-00.log
    const rotatedName = `${C.APP}-${timestamp}.${C.LOG}`;
    const rotatedPath = path.join(this.logDir, rotatedName);

    try {
      await fs.rename(this.logFilePath, rotatedPath);

      await fs.writeFile(this.logFilePath, '', { encoding: 'utf8' });
    } catch (err) {
      super.error(C.FAILED_TO_ROTATE, err as Error);
    }
  }

  private async checkFileSize() {
    try {
      await this.ensureLogDirAndFile();

      const stats = await fs.stat(this.logFilePath);

      if (stats.size >= this.maxSize) {
        await this.rotateFile();
      }
    } catch (err) {
      super.error(C.FAILED_TO_CHECK_LOG_FILE, err as Error);
    }
  }

  private format(level: LogLevelType, message: unknown, context = ''): LoggerFormatType {
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

    return {
      line: `[${timestamp}] [${level.toUpperCase()}]${context ? `[${context}]` : ''} message: ${msg}`,
      json,
    };
  }

  // ---------- write ----------

  private async writeToFile(message: string) {
    try {
      await this.ensureLogDirAndFile();

      await this.checkFileSize();

      await fs.appendFile(this.logFilePath, message + '\n', { encoding: 'utf8' });
    } catch (err) {
      super.error(C.FAILED_TO_WRIT_LOG_FILE, err as Error);
    }
  }

  // ---------- output ----------

  private show(level: LogLevelType, message: unknown, context?: string) {
    const { line, json } = this.format(level, message, context);

    if (this.isDev) {
      console.log(line);
    }

    this.writeToFile(json);
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