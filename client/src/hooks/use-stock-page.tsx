import { create } from "zustand";

interface StockInfo {
  code: string;
  name: string;
}

interface StockPageState {
  page: string;
  setPage: (page: string) => void;
  stock: StockInfo;
  setStock: (stock: StockInfo) => void;
}

const useStockPageStore = create<StockPageState>((set) => ({
  page: "main",
  setPage: (page) => set({ page }),
  stock: { code: "", name: "" },
  setStock: (stock) => set({ stock }),
}));

export const useStockPage = () => {
  const { page, setPage, stock, setStock } = useStockPageStore();

  return { page, setPage, stock, setStock };
};
