import { Injectable } from '@nestjs/common';

@Injectable()
export class AiObservabilityService {
    private lastLatencyMs = 0;
    private totalLatency = 0;
    private latencyCount = 0;

    private cacheHits = 0;
    private cacheMisses = 0;

    private lastStatus: number | null = null;
    private lastError: string | null = null;

    recordLatency(ms: number) {
        this.lastLatencyMs = ms;
        this.totalLatency += ms;
        this.latencyCount++;
    }

    recordCacheHit() {
        this.cacheHits++;
    }

    recordCacheMiss() {
        this.cacheMisses++;
    }

    recordStatus(status: number) {
        this.lastStatus = status;
    }

    recordError(message: string) {
        this.lastError = message;
    }

    getMetrics() {
        const avgLatencyMs =
            this.latencyCount > 0 ? this.totalLatency / this.latencyCount : 0;

        const cacheHitRatio =
            this.cacheHits + this.cacheMisses > 0
                ? this.cacheHits / (this.cacheHits + this.cacheMisses)
                : 0;

        return {
            lastLatencyMs: this.lastLatencyMs,
            avgLatencyMs,
            cacheHitRatio,
            lastStatus: this.lastStatus,
            lastError: this.lastError,
            timestamp: new Date().toISOString(),
        };
    }
}