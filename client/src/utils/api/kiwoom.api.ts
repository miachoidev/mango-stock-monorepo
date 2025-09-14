import { axiosInstance } from "@/utils/api/axios";
import { StockChart, StockChartDay, StockInfo } from "@/types/kioom";
import axios from "axios";

// 거래 관련 인터페이스
export interface OrderRequest {
  stk_cd: string; // 종목코드
  ord_qty: number; // 주문수량
  ord_prc: number; // 주문가격
  ord_tp: string; // 주문구분 ("00": 지정가, "03": 시장가)
}

export interface OrderResponse {
  success: boolean;
  message: string;
  orderId?: string;
  data?: any;
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

// 매수 주문
const buyStock = async (orderRequest: OrderRequest): Promise<OrderResponse> => {
  try {
    const response = await fetch("/api/kiwoom/order/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderRequest),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("매수 주문 API 호출 실패:", error);
    return {
      success: false,
      message: "매수 주문 중 네트워크 오류가 발생했습니다.",
    };
  }
};

// 매도 주문
const sellStock = async (
  orderRequest: OrderRequest
): Promise<OrderResponse> => {
  try {
    const response = await fetch("/api/kiwoom/order/sell", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderRequest),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("매도 주문 API 호출 실패:", error);
    return {
      success: false,
      message: "매도 주문 중 네트워크 오류가 발생했습니다.",
    };
  }
};

export const KIOOM_API = {
  getBalanceDetail,
  getStockChart,
  getStockChartDay,
  getStockChartWeek,
  buyStock,
  sellStock,
};
