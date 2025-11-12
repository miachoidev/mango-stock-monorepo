import { axiosInstance } from "@/utils/api/axios";
import { StockChart, StockChartDay } from "@/types/kioom";
// 거래 관련 인터페이스
export interface HoldingStockResponse {
  tot_pur_amt?: string;
  tot_evlt_amt?: string;
  tot_evlt_pl?: string;
  tot_prft_rt?: string;
  prsm_dpst_aset_amt?: string;
  tot_loan_amt?: string;
  tot_crd_loan_amt?: string;
  tot_crd_ls_amt?: string;
  acnt_evlt_remn_indv_tot?: HoldingStockResponseItem[];
  return_code: number; // 0: 성공, 20: 실패
  return_msg: string;
}
export interface HoldingStockResponseItem {
  stk_cd: string;
  stk_nm: string;
  evltv_prft: string;
  prft_rt: string;
  pur_pric: string;
  pred_close_pric: string;
  rmnd_qty: string;
  trde_able_qty: string;
  cur_prc: string;
  pred_buyq: string;
  pred_sellq: string;
  tdy_buyq: string;
  tdy_sellq: string;
  pur_amt: string;
  pur_cmsn: string;
  evlt_amt: string;
  sell_cmsn: string;
  tax: string;
  sum_cmsn: string;
  poss_rt: string;
  crd_tp: string;
  crd_tp_nm: string;
  crd_loan_dt: string;
}

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

// 보유 주식 목록 조회 (계좌평가잔고내역)
const getHoldingStocks = async (): Promise<HoldingStockResponse> => {
  try {
    const response = await axiosInstance.post(
      "/dostk/acnt",
      {
        qry_tp: "2",
        dmst_stex_tp: "KRX",
      },
      { headers: { "api-id": "kt00018" } }
    );

    const data = response.data;
    return data;
  } catch (error) {
    console.error("보유 주식 목록 조회 API 호출 실패:", error);
    return {
      return_code: 20,
      return_msg: "보유 주식 목록 조회 중 네트워크 오류가 발생했습니다.",
    };
  }
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
  getHoldingStocks,
  getStockChart,
  getStockChartDay,
  getStockChartWeek,
};
