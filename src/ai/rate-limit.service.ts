import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as C from '../constants';

@Injectable()
export class RateLimitService {
    private readonly requests: Map<string, number[]> = new Map();
    private readonly limit: number;
    private readonly windowMs = C.MINUTE;

    constructor(private readonly config: ConfigService) {
        this.limit = Number(this.config.get(C.AI_RATE_LIMIT_RPM, 20));
    }

    checkLimit(key: string): { allowed: boolean; retryAfter?: number } {
        const now = Date.now();
        const windowStart = now - this.windowMs;

        const timestamps = this.requests.get(key) || [];
        const filtered = timestamps.filter((t) => t > windowStart);

        if (filtered.length >= this.limit) {
            const retryAfter = Math.ceil((filtered.at(0) + this.windowMs - now) / 1000);
            return { allowed: false, retryAfter };
        }

        filtered.push(now);
        this.requests.set(key, filtered);

        return { allowed: true };
    }
}