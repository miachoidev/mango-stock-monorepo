import { ToolCall, ToolResponse } from "./adk-session";

export interface IMessage {
  id?: string;
  role: "user" | "assistant" | "tool";
  content?: string;
  author?: string;
  isNew?: boolean;
  timestamp?: string;
}

export class Message implements IMessage {
  id?: string;
  role: "user" | "assistant" | "tool" = "user";
  content?: string;
  author?: string;
  isNew?: boolean = false;
  timestamp?: string;

  constructor({
    content = "",
    author,
    isNew,
    timestamp,
  }: {
    content: string;
    author?: string;
    isNew?: boolean;
    timestamp?: string;
  }) {
    this.content = content;
    this.author = author;
    this.isNew = isNew;
    this.timestamp = timestamp;
  }
}

export class SystemMessage extends Message {
  role = "assistant" as const;
  constructor({
    content,
    author,
    isNew,
    timestamp,
  }: {
    content: string;
    author?: string;
    isNew?: boolean;
    timestamp?: string;
  }) {
    super({ content, author, isNew, timestamp });
  }
}

export class ToolMessage extends Message {
  role = "tool" as const;

  tool_call?: ToolCall;
  tool_response?: ToolResponse;

  constructor({
    content = "",
    author,
    isNew = false,
    timestamp,
    tool_call,
    tool_response,
  }: {
    content?: string;
    author?: string;
    isNew?: boolean;
    timestamp?: string;
    tool_call?: ToolCall;
    tool_response?: ToolResponse;
  }) {
    super({ content, author, isNew, timestamp });
    this.tool_call = tool_call;
    this.tool_response = tool_response;
  }
}

export interface FunctionCall {
  id: string;
  name: string | "transfer_to_agent";
  args: {
    // transfer_to_agent
    agent_name?: string;

    // filesystem_write_file
    file_path?: string;
    text?: string;

    // create_artifact
    artifact_name?: string;
    artifact_content?: string;

    // grounded_search_pipeline
    request?: string;
  };
}

export interface FunctionResponse {
  id: string;
  name: string | "create_artifact" | "filesystem_write_file";
  response: {
    result: string;
  };
}
