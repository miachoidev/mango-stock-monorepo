import { Button } from "@/components/ui/button";
import { useStockPage } from "@/hooks/use-stock-page";
import React from "react";

const Main = () => {
  const { page, setPage } = useStockPage();
  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <Button className="font-bold" onClick={() => setPage("daily-balance")}>
          일별잔고수익률
        </Button>
      </div>
    </div>
  );
};

export default Main;
