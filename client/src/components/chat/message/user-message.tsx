import {
  MessageContents,
  MessageContentProps,
  MessageComponent,
} from "./message";
import { cn } from "@/lib/utils";

export const UserMessageContent = ({
  className,
  message,
  ...props
}: MessageContentProps) => {
  const classNames = cn(
    "bg-[#fdbe02] text-black inline-flex text-start rounded-xl text-sm p-2 pl-4",
    className
  );

  return (
    <MessageComponent className={"justify-end"}>
      <div className="flex justify-end text-end max-w-[60%] min-w-[200px]">
        <MessageContents message={message} isUser={true}>
          <div className={classNames} {...props}>
            {message.content}
          </div>
        </MessageContents>
      </div>
    </MessageComponent>
  );
};
