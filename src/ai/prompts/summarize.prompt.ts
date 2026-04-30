import * as C from '../../constants';
import { PromptsSummarizeSizeType } from '../../types';

export function buildSummarizePrompt(
  content: string,
  maxLength: PromptsSummarizeSizeType = C.MEDIUM,
) {
  const lengthMap = {
    [C.SHORT]: 'Provide a very short summary (1-2 sentences).',
    [C.MEDIUM]: 'Provide a concise summary (3-5 sentences).',
    [C.DETAILED]: 'Provide a detailed summary (6-10 sentences).',
  };

  return `
You are an AI assistant. Summarize the following article.

${lengthMap[maxLength]}

Article text:
${content}
  `.trim();
}