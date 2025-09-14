import React from "react";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useStockPage } from "@/hooks/use-stock-page";
import { Trash2, Star } from "lucide-react";
import { toast } from "sonner";

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const { setPage, setStock } = useStockPage();

  const handleStockClick = (stock: { code: string; name: string }) => {
    setStock(stock);
    setPage("stock-detail");
  };

  const handleRemoveFromWatchlist = async (
    e: React.MouseEvent,
    code: string
  ) => {
    e.stopPropagation();
    const stock = watchlist.find(item => item.code === code);
    await removeFromWatchlist(code);
    if (stock) {
      toast.success(`${stock.name}이(가) 관심 목록에서 제거되었습니다.`);
    }
  };

  if (watchlist.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Star className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-center">
          아직 관심 종목이 없습니다.
          <br />
          주식을 검색하여 관심 목록에 추가해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          관심 종목 ({watchlist.length})
        </h2>
      </div>

      <div className="flex-1 space-y-2">
        {watchlist.map((stock) => (
          <div
            key={stock.code}
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleStockClick(stock)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{stock.name}</h3>
                <p className="text-sm text-gray-500">{stock.code}</p>
              </div>
              <button
                onClick={(e) => handleRemoveFromWatchlist(e, stock.code)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="관심 목록에서 제거"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
