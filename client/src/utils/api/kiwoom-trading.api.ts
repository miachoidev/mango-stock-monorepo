import { axiosInstance } from "./axios";

// 키움 증권 매도/매수 API 함수들
export interface TradingRequest {
  stk_cd: string; // 종목코드
  ord_qty: string; // 주문수량

  dmst_stex_tp: "KRX";
  ord_uv?: string;
  cond_uv?: string;
  trde_tp?: "0" | "3";
}

export interface TradingResponse {
  ord_no: string;
  return_msg: string;
  return_code: number;
}

export const buyStock = async (
  request: TradingRequest
): Promise<TradingResponse> => {
  try {
    const response = await axiosInstance.post("/dostk/ordr", request, {
      headers: { "api-id": "kt10000" },
    });

    return response.data as TradingResponse;
  } catch (error) {
    console.error("매수 주문 중 오류가 발생했습니다.", error);
    return {
      ord_no: "",
      return_msg: "매수 주문 중 오류가 발생했습니다.",
      return_code: 20,
    };
  }
};

// 매도 주문
export const sellStock = async (
  request: TradingRequest
): Promise<TradingResponse> => {
  try {
    const response = await axiosInstance.post("/dostk/ordr", request, {
      headers: { "api-id": "kt10001" },
    });

    return response.data as TradingResponse;
  } catch (error) {
    console.error("매수 주문 중 오류가 발생했습니다.", error);
    return {
      ord_no: "",
      return_msg: "매수 주문 중 오류가 발생했습니다.",
      return_code: 20,
    };
  }
};

export const KIWOOM_TRADING_API = {
  buyStock,
  sellStock,
};
