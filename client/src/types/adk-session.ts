export interface SSEResponse {
  event: EventType;
  session_id: string;
  error: string;
}
interface EventType {
  actions: { [key: string]: any };
  author: string;
  content: {
    parts: PartType[];
    role: "model" | "user" | string;
  };
  finishReason: "STOP";
  id: string;
  invocationId: string;
  timestamp: string;
  error: string;
}

interface PartType {
  functionCall: ToolCall;
  functionResponse: ToolResponse;
  text: string;
}

export interface ToolCall {
  id: string;
  name: string;
  args: {
    agent_name: string;
    [key: string]: any;

    stock_code?: string;
    stock_name?: string;
    average_price?: number;
    current_price?: number;
    is_holding?: boolean;
    profit_loss_amount?: number;
    profit_loss_rate?: number;
    reasons?: string[];
    recommendation?: "홀딩" | "매도" | "매수";
  };
}
export interface ToolResponse {
  id: string;
  name: string;
  response: {
    result: string;
    message: string;
    return_msg: string; // "get_all_sector_index" / "get_theme_group_info" / "get_theme_component_stocks"
  };
}

interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
