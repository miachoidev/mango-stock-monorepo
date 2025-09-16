"use client";
import React, { useState } from "react";
import { ChevronLeft, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ChatMain from "@/components/chat/chat-main";
import { usePathname, useRouter } from "next/navigation";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stockOpen, setStockOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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

        <div
          className={`w-full h-full stock-container relative ${
            stockOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex items-center py-2 absolute top-0 left-0 w-full z-10">
            {pathname !== "/stock" && (
              <ChevronLeft
                onClick={() => {
                  if (pathname === "/detail/[code]") {
                    router.push("/detail/[code]");
                    return;
                  }
                  router.push("/stock");
                }}
                className="cursor-pointer text-white"
              />
            )}
          </div>
          <div className="stock-container-inner h-full w-full px-[10%] min-w-[600px] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
