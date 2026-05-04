import * as C from '../constants';

export type PromptsSummarizeSizeType =
    | typeof C.SHORT
    | typeof C.MEDIUM
    | typeof C.DETAILED;

export type AnalyzePromptTaskType =
    | typeof C.REVIEW
    | typeof C.BUGS
    | typeof C.OPTIMIZE
    | typeof C.EXPLAIN;

export type CacheEntry = {
    value: any;
    expiresAt: number;
};
export type GeminiErrDataType = {
    code: number;
    message: string;
    status: string;
    details: any[];
};

export type GeminiErrType = {
    response?: { status: number };
    config?: { url: string };
};

export interface GeminiPart {
    text: string;
}

export type GeminiContent = {
    parts: GeminiPart[];
    role: string; // "model"
}

export type GeminiCandidate = {
    content: GeminiContent;
    finishReason: string; // "STOP"
    index: number;
}

export type GeminiPromptTokensDetails = {
    modality: string;
    tokenCount: number;
}

export type GeminiUsageMetadata = {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
    thoughtsTokenCount: number;
    promptTokensDetails: GeminiPromptTokensDetails[];
}

export type GeminiResponse = {
    candidates: GeminiCandidate[];
    usageMetadata: GeminiUsageMetadata;
    modelVersion: string; // "gemini-2.5-flash"
    responseId: string;
}

export type UsageSnapshotType = {
    totalRequests: number;
    requestsByEndpoint: Record<string, number>;
    tokenUsage: number;
};

export type GeminiGenerateReturnType = {
    text: string;
    totalToken: number;
}

export type AIRoutesType = typeof C.AI_ROUTES[keyof typeof C.AI_ROUTES];

export type AIAssistantRoleType = typeof C.USER | typeof C.ASSISTANT;
export type SessionMessageType = {
    role: AIAssistantRoleType;
    text: string;
    timestamp: number;
}