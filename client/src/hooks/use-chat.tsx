import { useMessageStore } from "@/hooks/use-messages";
import { SSEResponse } from "@/types/adk-session";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useChat = (sessionId?: string | null) => {
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isNewChat, setIsNewChat] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [prompt, setPrompt] = useState("");
  const scrollToBottomRef = useRef<(() => void) | null>(null);

  const {
    messages,
    pushUserMessage,
    pushToolMessage,
    startStreamingMessage,
    updateLastMessage,
    clearStreamingMessage,
  } = useMessageStore();

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  // 🟢 채팅 전송
  const onSubmit = async (message: string) => {
    if (isStreaming) return;

    if (message.trim()) {
      setIsNewChat(false);
      setIsStreaming(true);

      pushUserMessage(message);
      setPrompt("");

      // 메시지 전송 후 스크롤을 하단으로 이동
      setTimeout(() => {
        scrollToBottomRef.current?.();
      }, 100);

      try {
        // SSE 방식으로 스트리밍 요청
        const response = await fetch("/api/adk/streaming", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            message,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        const addContent = async (content: string, author: string) => {
          startStreamingMessage(author);
          let charIndex = 0;
          streamIntervalRef.current = setInterval(() => {
            if (charIndex < content.length) {
              charIndex++;
              const partialText = content.substring(0, charIndex);
              updateLastMessage(partialText);
            } else {
              clearInterval(streamIntervalRef.current!);
              setIsStreaming(false);
            }
          }, 12);
        };

        if (reader) {
          try {
            while (true) {
              const { done, value } = await reader.read();

              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split("\n");

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const data = line.slice(6);

                  if (data === "[DONE]") {
                    setIsStreaming(false);
                    return;
                  }

                  try {
                    let sseResponse: SSEResponse;
                    try {
                      sseResponse = JSON.parse(data) as SSEResponse;
                    } catch (e) {
                      const cleanedData = data
                        .replace(/\n/g, "\\n")
                        .replace(/\r/g, "\\r")
                        .replace(/\t/g, "\\t");
                      console.log("cleanedData🅾️", cleanedData);
                      sseResponse = JSON.parse(cleanedData) as SSEResponse;
                    }

                    console.log("🟢", sseResponse);
                    if (sseResponse.type === "start") {
                      continue;
                    }
                    if (sseResponse.type === "completion") {
                      setIsStreaming(false);
                      return;
                    }

                    if (
                      sseResponse.event_type === "text_generation" &&
                      sseResponse.content
                    ) {
                      addContent(sseResponse.content, "assistant");
                      continue;
                    }

                    if (
                      sseResponse.event_type === "function_call_request" &&
                      sseResponse.tool_calls
                    ) {
                      sseResponse.tool_calls.forEach((toolCall) => {
                        pushToolMessage({
                          timestamp: sseResponse.timestamp,
                          tool_call: toolCall,
                        });
                      });
                      continue;
                    }

                    if (
                      sseResponse.event_type === "function_response" &&
                      sseResponse.tool_responses
                    ) {
                      sseResponse.tool_responses.forEach((toolCall) => {
                        pushToolMessage({
                          timestamp: sseResponse.timestamp,
                          tool_response: toolCall,
                        });
                      });
                      continue;
                    }

                    if (sseResponse.type === "error" && sseResponse.error) {
                      const toolName = `error`;
                      const result = `error: ${sseResponse.error}`;
                      addContent(`${toolName} \n ${result}`, "assistant");
                      continue;
                    }
                  } catch (e) {
                    // JSON 파싱 실패 시 무시
                    console.warn("❌ Failed to parse SSE data:", data, e);
                  }
                }
              }
            }
          } finally {
            reader.releaseLock();
            setIsStreaming(false);
          }
        }
      } catch (error) {
        console.error("SSE request failed:", error);
        toast.error("Failed to send message");
        setIsStreaming(false);
        clearStreamingMessage();
      }
    }
  };

  return {
    messages,
    onSubmit,
    isStreaming,
    isNewChat,
    prompt,
    setPrompt,
    scrollToBottomRef,
  };
};
