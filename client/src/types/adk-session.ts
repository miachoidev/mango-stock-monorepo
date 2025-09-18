export interface SSEResponse {
  adk_event_id?: string;
  author?: string;
  event_id?: string;
  event_type?: EventType;
  invocation_id?: string;
  is_final_response?: boolean;
  partial?: boolean;
  partial_response?: string;
  session_id?: string;
  timestamp?: string;
  token_usage?: TokenUsage;

  type?: string; // "agent_event" "completion" "start" "agent_event" "error"

  //
  content?: string;
  // 마지막 응답
  final_response?: string;
  processing_time?: number;
  total_events?: number;

  // 도구 호출
  tool_calls?: ToolCall[];

  // 도구 응답
  // tool_response?: ToolResponse[];
  tool_responses?: ToolResponse[];

  // 에러
  error?: string;
}
type EventType =
  | "text_generation"
  | "function_call_request"
  | "function_response";

export interface ToolCall {
  tool_name?: string; // "grounding_agent"
  function_call_id?: string;
  arguments?: {
    agent_name?: string;
    request?: string;
    file_path?: string;
    text?: string;
  };
}
export interface ToolResponse {
  tool_name: string; // "grounding_agent"
  function_call_id?: string;
  result?: {
    result?: string;
  };
}

interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
