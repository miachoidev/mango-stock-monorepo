export interface SSEResponse {
  event: EventType;
  status: "streaming" | "completed";
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
  partial?: boolean;
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

    // stock_analysis_result
    stock_code?: string;
    stock_name?: string;
    average_price?: number;
    current_price?: number;
    is_holding?: boolean;
    profit_loss_amount?: number;
    profit_loss_rate?: number;
    reasons?: string[];
    recommendation?: "홀딩" | "매도" | "매수";

    // stock_recommendation_result
    investment_strategy?: string;
    market_flow?: string;
    popular_themes?: string[];

    rocommended_stocks: {
      종목코드: string;
      종목명: string;
      현재가: string;
      손절가: string;
      테마: string;
      상승률: string;
      "추천 등급": string;
      "투자 근거": string;
      목표가: string;
    }[];
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
