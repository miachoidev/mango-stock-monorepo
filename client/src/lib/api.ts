import { ChatResponse } from "../types/chat-message";
import { SessionsListResponse } from "../types/session";

// API 기본 설정
const API_BASE_URL = "http://localhost:8000";

// 채팅 API 호출 함수
export async function sendChatMessage(
  message: string,
  session_id?: string
): Promise<ChatResponse> {
  try {
    const body = {
      user_id: "stock_user",
      message: message,
      ...(session_id && { session_id }),
    };

    const response = await fetch(`${API_BASE_URL}/api/v1/adk/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error("채팅 API 호출 오류:", error);
    throw error;
  }
}

// 세션 목록 가져오기 API 호출 함수
export async function fetchSessions(
  user_id: string
): Promise<SessionsListResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/adk/sessions/${user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SessionsListResponse = await response.json();
    return data;
  } catch (error) {
    console.error("세션 목록 API 호출 오류:", error);
    throw error;
  }
}

// 응답에서 텍스트 메시지 추출
export function extractMessageText(chatResponse: ChatResponse): string {
  const lastMessage = chatResponse.messages[chatResponse.messages.length - 1];
  if (lastMessage?.content?.parts?.[0]?.text) {
    return lastMessage.content.parts[0].text;
  }
  return "응답을 받을 수 없습니다.";
}
