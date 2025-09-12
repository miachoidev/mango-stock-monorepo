import { useStockPage } from "@/hooks/use-stock-page";
import React from "react";

const Main = () => {
  const { setPage } = useStockPage();
  return (
    <div className="h-full">
      <div className="flex items-center justify-between flex-wrap w-[320px] mx-auto space-y-2">
        <MainItem title="종목 검색" onClick={() => setPage("stock-search")} />
        <MainItem
          title="일별잔고수익률"
          onClick={() => setPage("daily-balance")}
        />
        <MainItem title="보유 종목" onClick={() => setPage("daily-balance")} />
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
      className="font-bold cursor-pointer p-2 rounded-md min-w-[150px] h-[60px] flex items-center justify-center bg-blue-400 text-white"
      onClick={onClick}
    >
      {title}
    </div>
  );
};

export default Main;
