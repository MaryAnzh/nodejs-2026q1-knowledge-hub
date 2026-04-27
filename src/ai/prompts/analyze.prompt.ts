import * as C from '../../constants';
import { AnalyzePromptTaskType } from "../../types";

export function buildAnalyzePrompt(
    content: string,
    task: AnalyzePromptTaskType = C.REVIEW
) {
    const taskMap = {
        [C.REVIEW]: 'Provide a general review of the article.',
        [C.BUGS]: 'Identify logical issues, inconsistencies, or factual errors.',
        [C.OPTIMIZE]: 'Suggest improvements to clarity, structure, and readability.',
        [C.EXPLAIN]: 'Explain the content in simple terms.',
    };

    return `
You are an expert content analyst.

Task: ${taskMap[task]}

Analyze the following article and provide:
1. A detailed analysis.
2. A list of suggestions (bullet points).
3. A severity level: info, warning, or error.

Article:
"""
${content}
"""
  `.trim();
}