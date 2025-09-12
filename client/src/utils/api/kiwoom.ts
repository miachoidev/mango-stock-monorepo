import { axiosInstance } from "@/app/api/setting/api";
import { StockInfo } from "@/types/kioom";
import axios from "axios";

const getBalanceDetail = async () => {
  const today = new Date().toISOString().split("T")[0];

  const response = await axiosInstance.post(
    `/dostk/acnt`,
    { stex_tp: "0", qry_dt: today },
    { headers: { "api-id": "ka01690" } }
  );

  const data = await response.data;
  return data;
};

const searchStock = async (stk_cd: string): Promise<StockInfo> => {
  const response = await axios.post("/api/kiwoom/stock/search", {
    stk_cd,
  });

  return response.data;
};

export const KIOOM_API = {
  getBalanceDetail,
  searchStock,
};
