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
  setTradeType: (tradeType: "buy" | "sell") => void;
  tradeType: "buy" | "sell";
}

const useStockPageStore = create<StockPageState>((set) => ({
  page: "main",
  setPage: (page) => set({ page }),
  stock: { code: "", name: "" },
  setStock: (stock) => set({ stock }),
  setTradeType: (tradeType) => set({ tradeType }),
  tradeType: "buy",
}));

export const useStockPage = () => {
  const { page, setPage, stock, setStock, setTradeType, tradeType } =
    useStockPageStore();

  return { page, setPage, stock, setStock, setTradeType, tradeType };
};
