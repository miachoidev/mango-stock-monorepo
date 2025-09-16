"use client";

import React from "react";
import { useWatchlist } from "@/hooks/use-watchlist";
import { Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StockDataItem } from "@/components/stock/stock-data-item";

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const router = useRouter();

  const handleStockClick = (stock: { code: string; name: string }) => {
    router.push(
      `/stock/stock-detail?code=${stock.code}&name=${encodeURIComponent(
        stock.name
      )}`
    );
  };

  const handleRemoveFromWatchlist = async (
    e: React.MouseEvent,
    code: string
  ) => {
    e.stopPropagation();
    const stock = watchlist.find((item) => item.code === code);
    await removeFromWatchlist(code);
    if (stock) {
      toast.success(`${stock.name}이(가) 관심 목록에서 제거되었습니다.`);
    }
  };

  if (watchlist.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Star className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500 text-center">
          아직 관심 종목이 없습니다.
          <br />
          주식을 검색하여 관심 목록에 추가해보세요.
        </p>
        <button
          onClick={() => router.push("/stock/stock-data")}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          종목 검색하기
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col mt-6">
      <div className="mb-4">
        <div className="text-xl font-semibold text-white">관심 종목</div>
      </div>

      <div className="">
        {watchlist.map((stock) => (
          <StockDataItem
            key={stock.code}
            stock={stock}
            handleStockClick={handleStockClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
