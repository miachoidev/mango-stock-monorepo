import { cn } from "@/lib/utils";
import { useState } from "react";
import { IMessage } from "@/types/message";

export type MessageProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

const MessageComponent = ({ children, className, ...props }: MessageProps) => (
  <div className={cn("flex gap-3", className)} {...props}>
    {children}
  </div>
);

export const MessageContents = ({
  children,
  className,
  isUser = false,
  timestamp = true,
  message,
}: {
  children: React.ReactNode;
  message: IMessage;
  className?: string;
  isUser?: boolean;
  timestamp?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const formattedTimestamp = message.timestamp
    ? new Date(message.timestamp).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    : "";

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {isHovered && formattedTimestamp && timestamp && (
        <div
          className={cn(
            "absolute -bottom-4 text-xs text-gray-400 transition-opacity duration-200 w-[140px]",
            isUser ? "right-1" : "left-1"
          )}
        >
          {formattedTimestamp}
        </div>
      )}
    </div>
  );
};

export type MessageContentProps = {
  message: IMessage;
  markdown?: boolean;
  className?: string;
};

export { MessageComponent };
