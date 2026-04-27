export function buildTranslatePrompt(
    content: string,
    targetLanguage: string,
    sourceLanguage?: string,
) {
    return `
You are a translation assistant.

Translate the following article content into "${targetLanguage}".
${sourceLanguage ? `The original language is "${sourceLanguage}".` : 'Detect the source language automatically.'}

Return only the translated text.

Content:
"""
${content}
"""
  `.trim();
}