import { cn } from "@/lib/utils";
import React from "react";
import DailyBalance from "./page/daily-balance";
import { ArrowLeft } from "lucide-react";
import Main from "./page/stock-main";
import { useStockPage } from "@/hooks/use-stock-page";
import StockData from "./page/stock-data";
import StockDetail from "./page/stock-detail";
import Watchlist from "./page/watchlist";
import StockTrade from "./page/stock-trade";

const StockContainer = ({ className }: { className: string }) => {
  const { page, setPage } = useStockPage();

  return (
    <div
      className={cn(
        "w-[400px] h-[800px] mr-10 bg-white rounded-[40px] shadow-lg overflow-y-auto overflow-x-hidden relative scroll-smooth border-4 border-gray-200",
        className
      )}
    >
      <div className="flex items-center py-2 absolute top-0 left-0 w-full z-10">
        {page !== "main" && (
          <ArrowLeft
            onClick={() => {
              if (page === "stock-trade") {
                setPage("stock-detail");
                return;
              }
              setPage("main");
            }}
            className="absolute left-4 top-4 z-11 cursor-pointer"
          />
        )}
        <div className="text-2xl font-bold text-center w-full ">
          {page.toUpperCase()}
        </div>
      </div>

      <div className="h-full p-4 py-16">
        {page === "main" && <Main />}
        {page === "daily-balance" && <DailyBalance />}
        {page === "stock-data" && <StockData />}
        {page === "stock-detail" && <StockDetail />}
        {page === "watchlist" && <Watchlist />}
        {page === "stock-trade" && <StockTrade />}
      </div>
    </div>
  );
};

export default StockContainer;
