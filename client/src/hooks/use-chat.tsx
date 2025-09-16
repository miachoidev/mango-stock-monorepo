import { extractMessageText, sendChatMessage } from "@/utils/api/adk.api";
import { LocalMessage } from "@/types/chat-message";
import { useEffect, useRef } from "react";

import { create } from "zustand";

interface ChatState {
  messages: LocalMessage[];
  isStreaming: boolean;
  isFirstResponse: boolean;
  prompt: string;
  sessionId: string | undefined;
  setSessionId: (sessionId: string | undefined) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setIsFirstResponse: (isFirstResponse: boolean) => void;
  setPrompt: (prompt: string) => void;
  setMessages: (
    messages: LocalMessage[] | ((prev: LocalMessage[]) => LocalMessage[])
  ) => void;
}

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  setMessages: (messages) =>
    set((state) => ({
      messages:
        typeof messages === "function" ? messages(state.messages) : messages,
    })),
  isStreaming: false,
  isFirstResponse: false,
  prompt: "",
  sessionId: undefined,
  setSessionId: (sessionId) => set({ sessionId }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setIsFirstResponse: (isFirstResponse) => set({ isFirstResponse }),
  setPrompt: (prompt) => set({ prompt }),
}));

const useChat = (initialSessionId?: string) => {
  const {
    prompt,
    setPrompt,
    isFirstResponse,
    setIsFirstResponse,
    messages,
    setMessages,
    isStreaming,
    setIsStreaming,
    sessionId,
    setSessionId,
  } = useChatStore();
  const streamContentRef = useRef("");

  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  const stopStreaming = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setIsStreaming(false);
  };

  const streamResponse = async (message: string) => {
    if (isStreaming) {
      stopStreaming();
      return;
    }

    if (message.trim()) {
      setIsFirstResponse(true);
      setIsStreaming(true);

      const newMessageId = messages.length + 1;
      const userMessage = message.trim();

      // 사용자 메시지 추가
      setMessages((prev) => [
        ...prev,
        {
          id: newMessageId,
          role: "user",
          content: userMessage,
        },
      ]);

      setPrompt("");

      // 어시스턴트 메시지 플레이스홀더 추가

      try {
        // 세션 ID가 있으면 포함해서 API 호출

        const response = await sendChatMessage(userMessage, sessionId);
        setMessages((prev) => [
          ...prev,
          {
            id: newMessageId + 1,
            role: "assistant",
            content: "",
          },
        ]);
        const responseText = extractMessageText(response);

        // 세션 ID가 응답에 포함되고 현재 URL에 세션 ID가 없는 경우 주소만 변경
        if (response.session_id && !sessionId) {
          // window.history.pushState(null, "", `/chat/${response.session_id}`);
          setSessionId(response.session_id);
        }

        // 스트리밍 효과로 응답 표시
        let charIndex = 0;
        streamContentRef.current = "";

        streamIntervalRef.current = setInterval(() => {
          if (charIndex < responseText.length) {
            streamContentRef.current += responseText[charIndex];
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === newMessageId + 1
                  ? { ...msg, content: streamContentRef.current }
                  : msg
              )
            );
            charIndex++;
          } else {
            clearInterval(streamIntervalRef.current!);
            setIsStreaming(false);
          }
        }, 30);
      } catch (error: unknown) {
        console.error("API 호출 오류:", error);

        // 오류 메시지 표시
        const errorMessage =
          error instanceof Error
            ? `오류가 발생했습니다: ${(error as Error).message}`
            : "알 수 없는 오류가 발생했습니다.";

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessageId + 1
              ? { ...msg, content: errorMessage }
              : msg
          )
        );
        setIsStreaming(false);
      }
    }
  };

  return {
    messages,
    isStreaming,
    setPrompt,
    streamResponse,
    isFirstResponse,
    prompt,
  };
};

export default useChat;
