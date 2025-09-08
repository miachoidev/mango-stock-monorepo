import { cn } from "@/lib/utils";
import React from "react";

const StockContainer = ({ className }: { className: string }) => {
  return (
    <div
      className={cn(
        "w-[400px] h-[800px] mr-10 bg-white rounded-[40px] p-10 shadow-lg overflow-y-auto overflow-x-hidden relative scroll-smooth border-4 border-gray-200",
        className
      )}
    >
      StockContainer
    </div>
  );
};

export default StockContainer;
