// API 응답 타입 정의
export interface ChatMessage {
  content: {
    parts: Array<{
      videoMetadata: null | Record<string, unknown>;
      thought: null | Record<string, unknown>;
      inlineData: null | Record<string, unknown>;
      fileData: null | Record<string, unknown>;
      thoughtSignature: string;
      codeExecutionResult: null | Record<string, unknown>;
      executableCode: null | Record<string, unknown>;
      functionCall: null | Record<string, unknown>;
      functionResponse: null | Record<string, unknown>;
      text: string;
    }>;
    role: string;
  };
  groundingMetadata: null | Record<string, unknown>;
  partial: null | Record<string, unknown>;
  turnComplete: null | Record<string, unknown>;
  finishReason: string;
  errorCode: null | string | number;
  errorMessage: null | string;
  interrupted: null | boolean;
  customMetadata: null | Record<string, unknown>;
  usageMetadata: {
    cacheTokensDetails: null | Record<string, unknown>;
    cachedContentTokenCount: null | number;
    candidatesTokenCount: number;
    candidatesTokensDetails: null | Record<string, unknown>;
    promptTokenCount: number;
    promptTokensDetails: Array<{
      modality: string;
      tokenCount: number;
    }>;
    thoughtsTokenCount: number;
    toolUsePromptTokenCount: null | number;
    toolUsePromptTokensDetails: null | Record<string, unknown>;
    totalTokenCount: number;
    trafficType: null | string;
  };
  liveSessionResumptionUpdate: null | Record<string, unknown>;
  inputTranscription: null | Record<string, unknown>;
  outputTranscription: null | Record<string, unknown>;
  invocationId: string;
  author: string;
  actions: {
    skipSummarization: null | Record<string, unknown>;
    stateDelta: Record<string, unknown>;
    artifactDelta: Record<string, unknown>;
    transferToAgent: null | Record<string, unknown>;
    escalate: null | Record<string, unknown>;
    requestedAuthConfigs: Record<string, unknown>;
  };
  longRunningToolIds: null | string[];
  branch: null | Record<string, unknown>;
  id: string;
  timestamp: number;
}

export interface ChatResponse {
  session_id: string;
  messages: ChatMessage[];
}

// 로컬 메시지 타입 (UI용)
export interface LocalMessage {
  id: number;
  role: string;
  content: string;
  files?: File[];
  timestamp?: number;
}
