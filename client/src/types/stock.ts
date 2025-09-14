export interface StockItem {
  code: string;
  name: string;
}

// 보유 종목 정보
export interface HoldingStock {
  code: string;
  name: string;
  quantity: number; // 보유 수량
  averagePrice: number; // 평균 단가
  currentPrice: number; // 현재가
  totalValue: number; // 총 평가금액
  profitLoss: number; // 손익
  profitLossRate: number; // 손익률
  marketValue: number; // 시가총액
}

// 보유 종목 목록 응답
export interface HoldingsResponse {
  success: boolean;
  data: HoldingStock[];
  totalValue: number; // 총 평가금액
  totalProfitLoss: number; // 총 손익
  totalProfitLossRate: number; // 총 손익률
}
