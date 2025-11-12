import { HoldingsResponse, HoldingStock } from "@/types/stock";
import { axiosInstance } from "./axios";

// 보유 종목 목록 조회
export const getHoldings = async (): Promise<HoldingsResponse> => {
  try {
    const response = await axiosInstance.get("/api/kiwoom/holdings");
    return response.data;
  } catch (error) {
    console.error("보유 종목 조회 오류:", error);

    // 시뮬레이션 데이터 반환 (실제 API 연동 전까지)
    return {
      success: true,
      data: [
        {
          code: "005930",
          name: "삼성전자",
          quantity: 10,
          averagePrice: 70000,
          currentPrice: 75000,
          totalValue: 750000,
          profitLoss: 50000,
          profitLossRate: 7.14,
          marketValue: 450000000000000,
        },
        {
          code: "000660",
          name: "SK하이닉스",
          quantity: 5,
          averagePrice: 120000,
          currentPrice: 115000,
          totalValue: 575000,
          profitLoss: -25000,
          profitLossRate: -4.17,
          marketValue: 85000000000000,
        },
        {
          code: "035420",
          name: "NAVER",
          quantity: 3,
          averagePrice: 200000,
          currentPrice: 210000,
          totalValue: 630000,
          profitLoss: 30000,
          profitLossRate: 5.0,
          marketValue: 35000000000000,
        },
      ],
      totalValue: 1955000,
      totalProfitLoss: 55000,
      totalProfitLossRate: 2.81,
    };
  }
};

// 보유 종목 상세 정보 조회
export const getHoldingDetail = async (
  code: string
): Promise<HoldingStock | null> => {
  try {
    const response = await axiosInstance.get(`/api/kiwoom/holdings/${code}`);
    return response.data;
  } catch (error) {
    console.error("보유 종목 상세 조회 오류:", error);
    return null;
  }
};

export const HOLDINGS_API = {
  getHoldings,
  getHoldingDetail,
};
