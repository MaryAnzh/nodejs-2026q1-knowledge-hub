import * as C from '../../constants';
import { AnalyzePromptTaskType } from '../../types';

export function buildAnalyzePrompt(
  content: string,
  task: AnalyzePromptTaskType = C.REVIEW,
) {
  const taskMap = {
    [C.REVIEW]: 'Give a short review.',
    [C.BUGS]: 'Find logical or factual issues.',
    [C.OPTIMIZE]: 'Suggest improvements for clarity and structure.',
    [C.EXPLAIN]: 'Explain the article in simple terms.',
  };

  return `
Analyze the text.

Task: ${taskMap[task]}

Provide:
- brief analysis (3–5 sentences)
- 3–5 bullet suggestions
- severity: info | warning | error

Text:
${content}
  `.trim();
}
