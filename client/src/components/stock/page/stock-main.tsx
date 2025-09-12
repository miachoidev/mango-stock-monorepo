import { useStockPage } from "@/hooks/use-stock-page";
import { STOCK_DATA_API } from "@/utils/api/stock-data";
import React from "react";

const Main = () => {
  const { setPage, setStock } = useStockPage();

  const list = [
    { title: "검색 🔎", onClick: () => setPage("stock-data") },
    { title: "종목 검색", onClick: () => setPage("stock-search") },
    { title: "일별잔고수익률", onClick: () => setPage("daily-balance") },
    { title: "보유 종목", onClick: () => setPage("daily-balance") },
  ];

  const popularStocks = STOCK_DATA_API.getPopularStocks();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between flex-wrap w-[320px] mx-auto space-y-2 gap-2">
        {list.map((item) => (
          <MainItem
            key={item.title}
            title={item.title}
            onClick={item.onClick}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-8 w-full px-4">
        {popularStocks.map((stock) => (
          <div
            key={stock.code}
            className="bg-purple-500 px-4 py-2 rounded-md text-white text-sm cursor-pointer hover:bg-purple-600 transition-colors"
            onClick={() => {
              setPage("stock-detail");
              setStock(stock);
            }}
          >
            {stock.name}
          </div>
        ))}
      </div>
    </div>
  );
};

const MainItem = ({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="font-bold cursor-pointer p-2 rounded-md min-w-[150px] h-[60px] flex items-center justify-center bg-blue-400 text-white hover:bg-blue-500 transition-colors"
      onClick={onClick}
    >
      {title}
    </div>
  );
};

export default Main;
