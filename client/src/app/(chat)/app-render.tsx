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
import { ChatContainer } from "@/components/ui/custom/prompt/chat-container";
import { Message, MessageContent } from "@/components/ui/custom/prompt/message";
import { Markdown } from "@/components/ui/custom/prompt/markdown";
import { cn } from "@/lib/utils";
import { PromptLoader } from "@/components/ui/custom/prompt/loader";
import { PromptScrollButton } from "@/components/ui/custom/prompt/scroll-button";
import useChat from "@/hooks/use-chat";
import Mango from "@/components/chat/mango";

const chatSuggestions = [
  "주식 시장 현황이 어때?",
  "삼성전자 주가 분석해줘",
  "최근 주식 투자 트렌드는?",
];

export default function AppRender({
  sessionId: initialSessionId,
}: {
  sessionId?: string;
}) {
  const { messages, isStreaming, setPrompt, streamResponse, prompt } =
    useChat(initialSessionId);

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4 p-4 mx-auto max-w-screen-lg">
      <ChatContainer
        className={cn("relative w-full flex-1 space-y-4 py-10")}
        ref={containerRef}
        scrollToRef={bottomRef}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center justify-center">
              <div className="text-lg font-medium text-gray-400">
                AI Agent 주식 투자 에이전트
              </div>
              <div className="text-3xl mt-2 font-bold text-white">
                망고 스톡
              </div>
            </div>
            <div className="mt-10">
              <Mango />
            </div>
          </div>
        )}
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
                className={cn("max-w-[95%] flex-1", {
                  "justify-end text-end": !isAssistant,
                })}
              >
                {isAssistant ? (
                  <div className="text-foreground prose rounded-lg px-3 py-2">
                    <Markdown className={"space-y-4 text-white"}>
                      {message.content + message.content + message.content}
                    </Markdown>
                  </div>
                ) : (
                  <MessageContent className="bg-[#fdbe02] text-black inline-flex text-start rounded-3xl">
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
        className="w-full max-w-(--breakpoint-md) bg-[#1E2636] text-white border-blue-100"
        style={{
          boxShadow:
            "0 0 3px #6df9fe75, 0 0 20px #75d6da86, 0 0 40px #57f9ff7a",
        }}
      >
        <PromptInputTextarea placeholder="주식에 대해 무엇이든 물어보세요..." />

        <PromptInputActions className="flex items-center justify-end gap-2 pt-2">
          <PromptInputAction
            tooltip={isStreaming ? "Stop generation" : "Send message"}
          >
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full bg-[#ff9807] hover:bg-[#ff9807]/80"
              onClick={() => streamResponse(prompt)}
            >
              {isStreaming ? (
                <SquareIcon className="text-black" />
              ) : (
                <ArrowUpIcon className="text-black" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </Input>

      {/*Chat suggestions*/}
      {!messages.length && (
        <div className="flex flex-wrap gap-4">
          {chatSuggestions.map((suggestion: string, key: number) => (
            <div
              key={key}
              onClick={() => setPrompt(suggestion)}
              className="bg-[#ff9807] px-4 py-2 rounded-full text-xs font-medium text-white cursor-pointer hover:bg-[#ff9807]/80"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
