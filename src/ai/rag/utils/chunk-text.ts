import { ChunkConfigType } from "../../../types";

export function chunkText(
    text: string,
    { size, overlap }: ChunkConfigType,
): string[] {
    if (!text || typeof text !== 'string') return [];

    const words = text.split(/\s+/);
    const chunks: string[] = [];

    let start = 0;

    while (start < words.length) {
        const end = Math.min(start + size, words.length);
        const chunk = words.slice(start, end).join(' ');

        chunks.push(chunk);

        if (end === words.length) break;

        start = end - overlap;
    }

    return chunks;
}