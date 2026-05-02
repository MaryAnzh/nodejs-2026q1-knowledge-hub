import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as C from '../constants';
import { CacheEntry } from '../types';

@Injectable()
export class AiCacheService {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly ttlMs: number;

  constructor(private readonly config: ConfigService) {
    const ttlSec = Number(this.config.get(C.AI_CACHE_TTL_SEC, 300));
    this.ttlMs = ttlSec * 1000;
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key: string, value: any) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  buildKey(model: string, text: string, entity: string, params: any) {
    const normalizedText = text
      .replace(/(\r\n|\n|\r)/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const normalizedParams = JSON.stringify(params);

    return `${model}:${entity}:${normalizedText}:${normalizedParams}`;
  }
}
