"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Input,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/custom/prompt/input";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, Paperclip, SquareIcon, X } from "lucide-react";
import { Suggestion } from "@/components/ui/custom/prompt/suggestion";
import { ChatContainer } from "@/components/ui/custom/prompt/chat-container";
import { Message, MessageContent } from "@/components/ui/custom/prompt/message";
import { Markdown } from "@/components/ui/custom/prompt/markdown";
import { cn } from "@/lib/utils";
import { PromptLoader } from "@/components/ui/custom/prompt/loader";
import { PromptScrollButton } from "@/components/ui/custom/prompt/scroll-button";
import { sendChatMessage, extractMessageText } from "@/lib/api";
import { LocalMessage } from "@/lib/types";

const chatSuggestions = [
  "주식 시장 현황이 어때?",
  "삼성전자 주가 분석해줘",
  "최근 주식 투자 트렌드는?",
  "포트폴리오 관리 방법을 알려줘",
  "오늘 주목할 종목이 있을까?",
];

export default function AppRender({
  sessionId: initialSessionId,
}: {
  sessionId?: string;
}) {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(
    initialSessionId
  );

  const [isFirstResponse, setIsFirstResponse] = useState(false); // Understanding whether the conversation has started or not

  const [isStreaming, setIsStreaming] = useState(false);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamContentRef = useRef("");
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = React.useState<LocalMessage[]>([]);

  const stopStreaming = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setIsStreaming(false);
  };

  const streamResponse = async () => {
    if (isStreaming) {
      stopStreaming();
      return;
    }

    if (prompt.trim() || files.length > 0) {
      setIsFirstResponse(true);
      setIsStreaming(true);

      const newMessageId = messages.length + 1;
      const userMessage = prompt.trim();

      // 사용자 메시지 추가
      setMessages((prev) => [
        ...prev,
        {
          id: newMessageId,
          role: "user",
          content: userMessage,
          files: files,
        },
      ]);

      setPrompt("");
      setFiles([]);

      // 어시스턴트 메시지 플레이스홀더 추가
      setMessages((prev) => [
        ...prev,
        {
          id: newMessageId + 1,
          role: "assistant",
          content: "",
        },
      ]);

      try {
        // 세션 ID가 있으면 포함해서 API 호출
        const response = await sendChatMessage(userMessage, sessionId);
        const responseText = extractMessageText(response);

        // 세션 ID가 응답에 포함되고 현재 URL에 세션 ID가 없는 경우 주소만 변경
        if (response.session_id && !sessionId) {
          window.history.pushState(null, "", `/chat/${response.session_id}`);
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
      } catch (error) {
        console.error("API 호출 오류:", error);

        // 오류 메시지 표시
        const errorMessage =
          error instanceof Error
            ? `오류가 발생했습니다: ${error.message}`
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

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = "";
    }
  };

  const FileListItem = ({
    file,
    dismiss = true,
    index,
  }: {
    file: File;
    dismiss?: boolean;
    index: number;
  }) => (
    <div className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
      <Paperclip className="size-4" />
      <span className="max-w-[120px] truncate">{file.name}</span>
      {dismiss && (
        <button
          onClick={() => handleRemoveFile(index)}
          className="hover:bg-secondary/50 rounded-full p-1"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4 bg-white p-4 mx-auto max-w-screen-lg border border-gray-200 rounded-lg">
      <ChatContainer
        className={cn("relative w-full flex-1 space-y-4 pe-2", {
          hidden: !isFirstResponse,
        })}
        ref={containerRef}
        scrollToRef={bottomRef}
      >
        {messages.map((message) => {
          const isAssistant = message.role === "assistant";
          return (
            <Message
              key={message.id}
              className={
                message.role === "user" ? "justify-end" : "justify-start"
              }
            >
              <div
                className={cn("max-w-[85%] flex-1 sm:max-w-[75%]", {
                  "justify-end text-end": !isAssistant,
                })}
              >
                {isAssistant ? (
                  <div className="bg-muted text-foreground prose rounded-lg border px-3 py-2">
                    <Markdown className={"space-y-4"}>
                      {message.content}
                    </Markdown>
                  </div>
                ) : message?.files && message.files.length > 0 ? (
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex flex-wrap justify-end gap-2">
                      {message.files.map((file, index) => (
                        <FileListItem
                          key={index}
                          index={index}
                          file={file}
                          dismiss={false}
                        />
                      ))}
                    </div>
                    {message.content ? (
                      <MessageContent className="bg-primary text-primary-foreground inline-flex">
                        {message.content}
                      </MessageContent>
                    ) : null}
                  </div>
                ) : (
                  <MessageContent className="bg-primary text-primary-foreground inline-flex text-start">
                    {message.content}
                  </MessageContent>
                )}
              </div>
            </Message>
          );
        })}

        {isStreaming && (
          <div className="ps-2">
            <PromptLoader variant="pulse-dot" />
          </div>
        )}
      </ChatContainer>

      <div className="fixed right-4 bottom-4">
        <PromptScrollButton
          containerRef={containerRef}
          scrollRef={bottomRef}
          className="shadow-sm"
        />
      </div>

      <Input
        value={prompt}
        onValueChange={setPrompt}
        onSubmit={streamResponse}
        className="w-full max-w-(--breakpoint-md)"
      >
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {files.map((file, index) => (
              <FileListItem key={index} index={index} file={file} />
            ))}
          </div>
        )}

        <PromptInputTextarea placeholder="주식에 대해 무엇이든 물어보세요..." />

        <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
          <PromptInputAction tooltip="Attach files">
            <label
              htmlFor="file-upload"
              className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
            >
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Paperclip className="text-primary size-5" />
            </label>
          </PromptInputAction>

          <PromptInputAction
            tooltip={isStreaming ? "Stop generation" : "Send message"}
          >
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={streamResponse}
            >
              {isStreaming ? <SquareIcon /> : <ArrowUpIcon />}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </Input>

      {/*Chat suggestions*/}
      {!isFirstResponse && (
        <div className="flex flex-wrap gap-2">
          {chatSuggestions.map((suggestion: string, key: number) => (
            <Suggestion key={key} onClick={() => setPrompt(suggestion)}>
              {suggestion}
            </Suggestion>
          ))}
        </div>
      )}
    </div>
  );
}
