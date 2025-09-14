import { useState, useEffect } from 'react';
import { StockItem } from '@/types/stock';
import { WISHLIST_API } from '@/utils/api/wishlist.api';

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
      return true;
    }
    return false;
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