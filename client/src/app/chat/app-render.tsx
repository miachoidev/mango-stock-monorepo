"use client";

import React, { use, useEffect, useRef, useState } from "react";
import {
  Input,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/custom/prompt/input";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, SquareIcon } from "lucide-react";
import { Suggestion } from "@/components/ui/custom/prompt/suggestion";
import { ChatContainer } from "@/components/ui/custom/prompt/chat-container";
import { Message, MessageContent } from "@/components/ui/custom/prompt/message";
import { Markdown } from "@/components/ui/custom/prompt/markdown";
import { cn } from "@/lib/utils";
import { PromptLoader } from "@/components/ui/custom/prompt/loader";
import { PromptScrollButton } from "@/components/ui/custom/prompt/scroll-button";
import useChat from "@/hooks/use-chat";

const chatSuggestions = [
  "주식 시장 현황이 어때?",
  "삼성전자 주가 분석해줘",
  "최근 주식 투자 트렌드는?",
  "포트폴리오 관리 방법을 알려줘",
];

export default function AppRender({
  sessionId: initialSessionId,
}: {
  sessionId?: string;
}) {
  const {
    messages,
    isStreaming,
    setPrompt,
    streamResponse,
    isFirstResponse,
    prompt,
  } = useChat(initialSessionId);

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4 p-4 mx-auto max-w-screen-lg border-x-2 border-gray-500">
      <ChatContainer
        className={cn("relative w-full flex-1 space-y-4 py-10 bg-gray-50")}
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
        onSubmit={() => streamResponse(prompt)}
        className="w-full max-w-(--breakpoint-md)"
      >
        <PromptInputTextarea placeholder="주식에 대해 무엇이든 물어보세요..." />

        <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
          <PromptInputAction
            tooltip={isStreaming ? "Stop generation" : "Send message"}
          >
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => streamResponse(prompt)}
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
