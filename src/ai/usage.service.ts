import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { UsageSnapshotType } from '../types';

@Injectable()
export class UsageService {
    totalRequests = 0;
    requestsByEndpoint: Record<string, number> = {};
    tokenUsage = 0;

    private statDir = path.join(process.cwd(), 'ai-stat');
    private statFilePath = path.join(this.statDir, 'ai-stat.json');

    constructor() {
        this.loadFromFile();
    }

    private cleanInMemory() {
        this.totalRequests = 0;
        this.tokenUsage = 0;
        this.requestsByEndpoint = {};
    }

    private mergeStats(file: UsageSnapshotType): UsageSnapshotType {
        const merged: UsageSnapshotType = {
            totalRequests: file.totalRequests + this.totalRequests,
            tokenUsage: file.tokenUsage + this.tokenUsage,
            requestsByEndpoint: { ...file.requestsByEndpoint },
        };

        for (const key in this.requestsByEndpoint) {
            merged.requestsByEndpoint[key] =
                (merged.requestsByEndpoint[key] ?? 0) + this.requestsByEndpoint[key];
        }

        this.cleanInMemory();
        return merged;
    }

    private async loadFromFile() {
        try {
            const raw = await fs.readFile(this.statFilePath, 'utf8');
            const fileData: UsageSnapshotType = JSON.parse(raw);

            const merged = this.mergeStats(fileData);

            await fs.writeFile(this.statFilePath, JSON.stringify(merged, null, 2));
            this.cleanInMemory();

        } catch {
            await fs.mkdir(this.statDir, { recursive: true });

            const initial: UsageSnapshotType = {
                totalRequests: this.totalRequests,
                tokenUsage: this.tokenUsage,
                requestsByEndpoint: this.requestsByEndpoint,
            };

            await fs.writeFile(this.statFilePath, JSON.stringify(initial, null, 2));
            this.cleanInMemory();
        }
    }

    async increment(endpoint: string, tokens?: number) {
        this.totalRequests++;

        this.requestsByEndpoint[endpoint] =
            (this.requestsByEndpoint[endpoint] || 0) + 1;

        if (tokens) {
            this.tokenUsage += tokens;
        }

        await this.loadFromFile();
    }

    getStats() {
        return {
            totalRequests: this.totalRequests,
            requestsByEndpoint: this.requestsByEndpoint,
            tokenUsage: this.tokenUsage,
        };
    }
}