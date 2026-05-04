import { AIAssistantRoleType } from "../../types";
import * as C from '../../constants/dictionary'; ``

export function buildChatPrompt(history: { role: AIAssistantRoleType; text: string }[], newText: string, login: string) {
    const formattedHistory = history
        .slice(-5)
        .map(m => `${m.role === C.USER ? login : C.GEMINI}: ${m.text}`)
        .join('\n');

    return `${formattedHistory}\n${login}: ${newText}\n${C.GEMINI}:`;
}