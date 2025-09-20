import { cn } from "@/lib/utils";
import {
  MessageComponent,
  MessageContentProps,
  MessageContents,
} from "./message";
import { Markdown } from "../../ui/custom/prompt/markdown";

export const SystemMessageContent = ({
  className,
  message,
  ...props
}: MessageContentProps) => {
  const classNames = cn(
    "bg-[#cacaca5] text-foreground pr-3 py-0 min-w-[200px]",
    className
  );

  return (
    <MessageComponent className={"justify-start"}>
      <div className="flex justify-start text-start max-w-[95%]">
        <MessageContents className={classNames} message={message} {...props}>
          <Markdown className="system-markdown text-white text-md text-sm">
            {message.content || ""}
          </Markdown>
        </MessageContents>
      </div>
    </MessageComponent>
  );
};
