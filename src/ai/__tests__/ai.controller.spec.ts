import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AiController } from '../ai.controller';
import { GeminiService } from '../gemini.service';
import * as C from '../../constants';

describe('AiController (Vitest)', () => {
  let controller: AiController;
  let gemini: GeminiService;
  const mockedResponse = 'mocked-response';

  beforeEach(() => {
    gemini = {
      generate: vi.fn().mockResolvedValue(mockedResponse),
    } as any;

    controller = new AiController(gemini);
  });

  it('summarize calls gemini.generate', async () => {
    const dto = { text: 'Some long text', maxLength: C.MEDIUM };

    const result = await controller.summarize(dto);

    expect(gemini.generate).toHaveBeenCalled();
    expect(result).toBe(mockedResponse);
  });

  it('translate calls gemini.generate', async () => {
    const dto = {
      text: 'Hello',
      targetLanguage: 'Spanish',
      sourceLanguage: 'English',
    };

    const result = await controller.translate(dto);

    expect(gemini.generate).toHaveBeenCalled();
    expect(result).toBe(mockedResponse);
  });

  it('analyze calls gemini.generate', async () => {
    const dto = { text: 'Some text', task: C.REVIEW };

    const result = await controller.analyze(dto);

    expect(gemini.generate).toHaveBeenCalled();
    expect(result).toBe(mockedResponse);
  });
});
