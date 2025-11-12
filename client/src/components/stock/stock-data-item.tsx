import { StockItem } from "@/types/stock";
import { WISHLIST_API } from "@/utils/api/wishlist.api";
import { Heart, HeartIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const StockDataItem = ({
  stock,
  handleStockClick,
}: {
  stock: StockItem;
  handleStockClick: (stock: StockItem) => void;
}) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const isFavorite = (code: string) => {
      return wishlist.some((item: StockItem) => item.code === code) as boolean;
    };
    setLiked(isFavorite(stock.code));
  }, [stock]);

  const handleFavorite = (stock: StockItem) => {
    if (liked) {
      WISHLIST_API.removeWishlist({ code: stock.code, name: stock.name });
    } else {
      WISHLIST_API.addWishlist({ code: stock.code, name: stock.name });
    }
    setLiked(!liked);
  };

  return (
    <div
      className="flex items-center justify-between p-4 bg-none cursor-pointer group border-b border-gray-700 hover:bg-[#19212A]"
      onClick={() => handleStockClick(stock)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#ffcf76] to-[#ff9807] rounded-full flex items-center justify-center text-white font-bold text-sm">
          {stock.name.slice(0, 2)}
        </div>
        <div>
          <div className="font-semibold text-white transition-colors">
            {stock.name}
          </div>
          <div className="text-xs text-gray-300">{stock.code}</div>
        </div>
      </div>

      <div
        className="p-2 rounded-full transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          handleFavorite(stock);
        }}
      >
        {liked ? (
          <HeartIcon
            fill="#d14808"
            className="w-5 h-5 cursor-pointer text-[#d14808]"
          />
        ) : (
          <Heart className="w-5 h-5 cursor-pointer text-gray-400 hover:text-[#d14808] transition-colors" />
        )}
      </div>
    </div>
  );
};
