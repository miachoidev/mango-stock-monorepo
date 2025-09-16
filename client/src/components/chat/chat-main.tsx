import { cn } from "@/lib/utils";
import React from "react";
import AppRender from "@/app/chat/app-render";

const ChatMain = ({ className }: { className: string }) => {
  return (
    <div className={cn("w-full h-full", className)}>
      <AppRender />
    </div>
  );
};

export default ChatMain;
