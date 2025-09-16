"use client";
import React, { useState } from "react";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ChatMain from "@/components/chat/chat-main";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stockOpen, setStockOpen] = useState(true);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-[#fff] w-full mx-auto border border-neutral-200",
        "h-screen"
      )}
    >
      <ChatMain className="w-full h-full flex-1" />

      <div
        className={cn(
          "h-full flex items-center justify-center flex-col bg-blue-50 transition-all duration-300 relative",
          stockOpen ? "flex-1 w-full" : "w-fit"
        )}
      >
        <Button
          className="absolute top-1/2 -translate-y-1/2 -left-10 cursor-pointer bg-blue-400 hover:bg-blue-500 rounded-l-lg rounded-r-none"
          onClick={() => setStockOpen(!stockOpen)}
        >
          <Settings className="text-white" />
        </Button>

        <div className={`w-full h-full ${stockOpen ? "block" : "hidden"}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
