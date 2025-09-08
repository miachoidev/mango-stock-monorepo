// 세션 관련 타입 정의
export interface SessionResponse {
  session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface SessionsListResponse {
  sessions: SessionResponse[];
  total_count: number;
}
