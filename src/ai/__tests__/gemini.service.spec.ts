import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { GeminiService } from '../gemini.service';
import { AiCacheService } from '../cache.service';
import { ConfigService } from '@nestjs/config';

vi.mock('axios');

describe('GeminiService (Vitest)', () => {
  let service: GeminiService;
  let cache: AiCacheService;
  const aiResponse = 'AI response';
  const prompt = 'prompt';
  const cachedValue = 'cached-value';

  beforeEach(() => {
    vi.clearAllMocks();

    const config = {
      get: (key: string) => {
        if (key === 'GEMINI_API_KEY') return 'test-key';
        if (key === 'GEMINI_API_BASE_URL') return 'https://fake.api';
        if (key === 'GEMINI_MODEL') return 'gemini-test';
        return null;
      },
    } as unknown as ConfigService;

    cache = new AiCacheService(config);
    service = new GeminiService(config, cache);
  });

  it('returns cached value', async () => {
    vi.spyOn(cache, 'get').mockReturnValue(cachedValue);

    const result = await service.generate(prompt);
    expect(result).toBe(cachedValue);
  });

  it('calls axios when no cache', async () => {
    vi.spyOn(cache, 'get').mockReturnValue(null);

    (axios.post as any).mockResolvedValue({
      data: {
        candidates: [{ content: { parts: [{ text: aiResponse }] } }],
      },
    });

    const result = await service.generate(prompt);
    expect(result).toBe(aiResponse);
  });

  it('throws on API error', async () => {
    vi.spyOn(cache, 'get').mockReturnValue(null);

    (axios.post as any).mockRejectedValue({
      response: { status: 500 },
    });

    await expect(service.generate(prompt)).rejects.toThrow();
  });
});
