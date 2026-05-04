import { Injectable } from '@nestjs/common';
import { SessionMessageType, AIAssistantRoleType } from '../types';
import * as C from '../constants/dictionary';

@Injectable()
export class AiSessionService {
    private sessions = new Map<string, SessionMessageType[]>();
    private readonly ttlMs = 5 * 60 * 1000; // 5 minutes
    private userLogin: string = C.USER;

    private cleanup() {
        const now = Date.now();
        for (const [sessionId, messages] of this.sessions.entries()) {
            const last = messages[messages.length - 1];
            if (!last || now - last.timestamp > this.ttlMs) {
                this.sessions.delete(sessionId);
            }
        }
    }

    getSession(sessionId: string): SessionMessageType[] {
        this.cleanup();
        return this.sessions.get(sessionId) ?? [];
    }

    saveMessage(sessionId: string, role: AIAssistantRoleType, text: string) {
        const history = this.getSession(sessionId);
        history.push({ role, text, timestamp: Date.now() });
        this.sessions.set(sessionId, history);
    }

    createSessionId(): string {
        return Math.random().toString(36).substring(2, 12);
    }
}