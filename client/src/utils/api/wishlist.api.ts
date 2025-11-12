import { StockItem } from "@/types/stock";

const getWishlist = async (): Promise<StockItem[]> => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  return wishlist;
};
const addWishlist = async (wishItem: StockItem) => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

  if (wishlist.some((item: StockItem) => item.code === wishItem.code)) {
    return;
  }
  const newWishlist = [...wishlist, wishItem];
  localStorage.setItem("wishlist", JSON.stringify(newWishlist));
};

const removeWishlist = async (wishItem: StockItem) => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const newWishlist = wishlist.filter(
    (item: StockItem) => item.code !== wishItem.code
  );
  localStorage.setItem("wishlist", JSON.stringify(newWishlist));
};

export const WISHLIST_API = {
  getWishlist,
  addWishlist,
  removeWishlist,
};
