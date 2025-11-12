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
          let currentContent = "";
          try {
            while (true) {
              const { done, value } = await reader.read();

              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split("\n");

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const data = line.slice(6);

                  try {
                    let sseResponse: SSEResponse;
                    try {
                      sseResponse = JSON.parse(data) as SSEResponse;
                    } catch (e) {
                      const cleanedData = data
                        .replace(/\n/g, "\\n")
                        .replace(/\r/g, "\\r")
                        .replace(/\t/g, "\\t");

                      sseResponse = JSON.parse(cleanedData) as SSEResponse;
                    }

                    console.log("🟢", sseResponse);
                    if (sseResponse.status === "completed") {
                      return;
                    }

                    if (sseResponse.error) {
                      const result = `error: ${sseResponse.error}`;
                      addContent(result, "assistant");
                      continue;
                    }

                    const contents = sseResponse.event.content?.parts || [];

                    if (sseResponse.event?.partial) {
                      contents.forEach((content) => {
                        if (content.text) {
                          currentContent += content.text;
                        }
                      });
                      continue;
                    }
                    if (currentContent) {
                      addContent(currentContent, "assistant");
                      currentContent = "";
                      continue;
                    }

                    contents.forEach((content) => {
                      if (content.text) {
                        addContent(content.text, "assistant");
                        return;
                      }

                      if (content.functionCall) {
                        pushToolMessage({
                          timestamp: sseResponse.event.timestamp,
                          tool_call: content.functionCall,
                        });
                      }
                      if (content.functionResponse) {
                        pushToolMessage({
                          timestamp: sseResponse.event.timestamp,
                          tool_response: content.functionResponse,
                        });
                      }
                    });
                  } catch (e) {
                    // JSON 파싱 실패 시 무시
                    console.warn("❌ Failed to parse SSE data:", data, e);
                  }
                }
              }
            }
          } finally {
            reader.releaseLock();
            if (currentContent) {
              addContent(currentContent, "assistant");
              currentContent = "";
              return;
            }
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
