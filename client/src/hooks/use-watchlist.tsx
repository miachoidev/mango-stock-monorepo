import { useState, useEffect } from 'react';
import { StockItem } from '@/types/stock';
import { WISHLIST_API } from '@/utils/api/wishlist.api';
import { toast } from 'sonner';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<StockItem[]>([]);

  const loadWatchlist = async () => {
    const data = await WISHLIST_API.getWishlist();
    setWatchlist(data);
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const addToWatchlist = async (stock: StockItem) => {
    const isAlreadyInWatchlist = watchlist.some(item => item.code === stock.code);

    if (!isAlreadyInWatchlist) {
      await WISHLIST_API.addWishlist(stock);
      await loadWatchlist();
      toast.success(`${stock.name}이(가) 관심 목록에 추가되었습니다.`);
      return true;
    } else {
      toast.info(`${stock.name}은(는) 이미 관심 목록에 있습니다.`);
      return false;
    }
  };

  const removeFromWatchlist = async (code: string) => {
    const stockToRemove = watchlist.find(item => item.code === code);
    if (stockToRemove) {
      await WISHLIST_API.removeWishlist(stockToRemove);
      await loadWatchlist();
    }
  };

  const isInWatchlist = (code: string) => {
    return watchlist.some(item => item.code === code);
  };

  const toggleWatchlist = async (stock: StockItem) => {
    if (isInWatchlist(stock.code)) {
      await removeFromWatchlist(stock.code);
      return false;
    } else {
      return await addToWatchlist(stock);
    }
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
  };
};