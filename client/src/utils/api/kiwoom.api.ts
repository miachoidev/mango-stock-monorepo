import { axiosInstance } from "@/app/api/setting/api";
import { StockChart, StockChartDay, StockInfo } from "@/types/kioom";
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

// tic_scope: 틱 범위
const getStockChart = async (stk_cd: string, tic_scope: number) => {
  const response = await axiosInstance.post(
    "/dostk/chart",
    {
      stk_cd: stk_cd,
      tic_scope: tic_scope.toString(),
      upd_stkpc_tp: "1",
    },
    { headers: { "api-id": "ka10080" } }
  );

  return response.data.stk_min_pole_chart_qry as StockChart[];
};
const getStockChartDay = async (stk_cd: string) => {
  const today = new Date().toISOString().split("T")[0];
  const response = await axiosInstance.post(
    "/dostk/chart",
    {
      stk_cd: stk_cd,
      base_dt: today,
      upd_stkpc_tp: "1",
    },
    { headers: { "api-id": "ka10081" } }
  );

  return response.data.stk_dt_pole_chart_qry as StockChartDay[];
};
const getStockChartWeek = async (stk_cd: string) => {
  const today = new Date().toISOString().split("T")[0];
  const response = await axiosInstance.post(
    "/dostk/chart",
    {
      stk_cd: stk_cd,
      base_dt: today,
      upd_stkpc_tp: "1",
    },
    { headers: { "api-id": "ka10082" } }
  );

  return response.data.stk_stk_pole_chart_qry as StockChartDay[];
};

export const KIOOM_API = {
  getBalanceDetail,
  getStockChart,
  getStockChartDay,
  getStockChartWeek,
};
