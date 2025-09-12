import { create } from "zustand";

interface StockPageState {
  page: string;
  setPage: (page: string) => void;
}

const useStockPageStore = create<StockPageState>((set) => ({
  page: "main",
  setPage: (page) => set({ page }),
}));

export const useStockPage = () => {
  const { page, setPage } = useStockPageStore();

  return { page, setPage };
};
