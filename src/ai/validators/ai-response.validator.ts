import * as C from '../../constants';

export function validateAiResponse(text: string): string | false {
    if (!text || typeof text !== 'string') {
        return false;
    }

    const trimmed = text.trim();

    const looksLikeHtml = /^<[^>]+>/.test(trimmed);
    const looksLikeJson = /^[{\[] /.test(trimmed);

    if (looksLikeHtml || looksLikeJson) {
        return false;
    }

    if (trimmed.length < 3) {
        return false;
    }

    return trimmed;
}