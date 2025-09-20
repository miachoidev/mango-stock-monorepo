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
import Mango from "@/components/chat/mango";
import { STOCK_TEMPLATE } from "@/utils/template";
import { useChat } from "@/hooks/use-chat";
import { ToolMessageContent } from "@/components/chat/message/tool-message";
import { UserMessageContent } from "@/components/chat/message/user-message";
import { ToolMessage } from "@/types/message";
import { SystemMessageContent } from "@/components/chat/message/system-message";

export default function AppRender({
  sessionId: initialSessionId,
}: {
  sessionId?: string;
}) {
  const { messages, onSubmit, isStreaming, prompt, setPrompt } =
    useChat(initialSessionId);

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatSuggestions = [
    { id: 1, label: "주식 시장 현황이 어때?", value: "주식 시장 현황이 어때?" },
    { id: 2, label: "삼성전자 주가 분석해줘", value: "005930" },
    {
      id: 3,
      label: "최근 주식 투자 트렌드는?",
      value: "최근 주식 투자 트렌드는?",
    },
  ];

  const onClickChatSuggestion = (suggestion: {
    id: number;
    label: string;
    value: string;
  }) => {
    if (suggestion.id === 1) {
      onSubmit(suggestion.value);
    } else if (suggestion.id === 2) {
      onSubmit(STOCK_TEMPLATE.aiTemplate("삼성전자", suggestion.value));
    } else if (suggestion.id === 3) {
      onSubmit(suggestion.value);
    }
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4 p-4 mx-auto max-w-screen-lg">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="flex flex-col items-center justify-center">
            <div className="text-lg font-medium text-gray-400">
              AI Agent 주식 투자 에이전트
            </div>
            <div className="text-3xl mt-2 font-bold text-white">망고 스톡</div>
          </div>
          <div className="mt-10 w-full h-full justify-center items-center flex overflow-x-hidden overflow-y-hidden">
            <Mango />
          </div>
        </div>
      )}
      <ChatContainer
        className={cn(
          "relative w-full flex-1 space-y-4 py-4 px-20 m-auto flex"
        )}
        ref={containerRef}
        scrollToRef={bottomRef}
      >
        {messages.map((message, idx) => {
          if (message.role === "tool") {
            return (
              <ToolMessageContent
                key={idx}
                message={message as ToolMessage}
                messages={messages}
              />
            );
          }
          if (message.role === "assistant") {
            return (
              <SystemMessageContent
                className="mt-5"
                key={idx}
                message={message}
              />
            );
          }
          if (message.role === "user") {
            return <UserMessageContent key={idx} message={message} />;
          }
        })}

        {isStreaming && (
          <div className="ps-2">
            <PromptLoader variant="pulse-dot" className="bg-white" />
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
        onSubmit={() => {
          onSubmit(prompt);
          setPrompt("");
        }}
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
              onClick={() => {
                onSubmit(prompt);
                setPrompt("");
              }}
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
        <section className="flex flex-wrap gap-4">
          {chatSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => {
                onClickChatSuggestion(suggestion);
              }}
              className="bg-[#ff9807] px-4 py-2 rounded-full text-xs font-medium text-white cursor-pointer hover:bg-[#ff9807]/80"
            >
              {suggestion.label}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
