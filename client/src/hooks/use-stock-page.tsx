import { create } from "zustand";

type PageType = "daily-balance" | "main" | "stock-search";
interface StockPageState {
  page: PageType;
  setPage: (page: PageType) => void;
}

const useStockPageStore = create<StockPageState>((set) => ({
  page: "main",
  setPage: (page) => set({ page }),
}));

export const useStockPage = () => {
  const { page, setPage } = useStockPageStore();

  return { page, setPage };
};
