import { ToolCall, ToolResponse } from "@/types/adk-session";
import { Message, SystemMessage, ToolMessage } from "@/types/message";
import { create } from "zustand";

export interface MessageState {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  pushUserMessage: (message: string, author?: string) => void;
  pushToolMessage: ({
    timestamp,
    tool_call,
    tool_response,
  }: {
    timestamp?: string;
    tool_call?: ToolCall;
    tool_response?: ToolResponse;
  }) => void;
  // 스트리밍을 위한 새로운 메소드들 추가
  startStreamingMessage: (author?: string) => void;
  updateLastMessage: (content: string) => void;
  clearStreamingMessage: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  setMessages: (messages: Message[]) => {
    // 기존 메시지들은 isNew: false로 설정
    const messagesWithoutNew = messages.map((msg) => ({
      ...msg,
      isNew: false,
    }));
    set({ messages: messagesWithoutNew });
  },
  pushUserMessage: (message: string, author?: string) =>
    set((state) => {
      // 기존 메시지들의 isNew를 false로 설정하고 새 메시지는 isNew: true
      const updatedMessages = state.messages.map((msg) => ({
        ...msg,
        isNew: false,
      }));
      return {
        messages: [
          ...updatedMessages,
          new Message({ content: message, author, isNew: true }),
        ],
      };
    }),

  pushToolMessage: ({
    timestamp,
    tool_call,
    tool_response,
  }: {
    timestamp?: string;
    tool_call?: ToolCall;
    tool_response?: ToolResponse;
  }) =>
    set((state) => {
      const updatedMessages = state.messages.map((msg) => ({
        ...msg,
        isNew: false,
      }));
      return {
        messages: [
          ...updatedMessages,
          new ToolMessage({ timestamp, tool_call, tool_response, isNew: true }),
        ],
      };
    }),

  // 스트리밍을 위한 새로운 메소드들
  startStreamingMessage: (author?: string) =>
    set((state) => {
      // 기존 메시지들의 isNew를 false로 설정하고 새 메시지는 isNew: true
      const updatedMessages = state.messages.map((msg) => ({
        ...msg,
        isNew: false,
      }));
      return {
        messages: [
          ...updatedMessages,
          new SystemMessage({ content: "", author, isNew: true }),
        ],
      };
    }),
  updateLastMessage: (content: string) =>
    set((state) => {
      const newMessages = [...state.messages];
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1].content = content;
      }
      return { messages: newMessages };
    }),

  clearStreamingMessage: () =>
    set((state) => {
      const updatedMessages = state.messages.map((msg) => ({
        ...msg,
        isNew: false,
      }));
      return { messages: updatedMessages };
    }),
}));
