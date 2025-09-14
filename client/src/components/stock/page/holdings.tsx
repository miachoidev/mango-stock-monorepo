import React, { useEffect, useState, useCallback } from "react";
import { HoldingStock } from "@/types/stock";
import { KIOOM_API } from "@/utils/api/kiwoom.api";
import { useStockPage } from "@/hooks/use-stock-page";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const Holdings = () => {
  const { setPage, setStock } = useStockPage();
  const [holdings, setHoldings] = useState<HoldingStock[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [totalProfitLossRate, setTotalProfitLossRate] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchHoldings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await KIOOM_API.getHoldingStocks();
      console.log("보유 종목 조회 응답:", response);
      if (response.return_code !== 0) {
        toast.error(response.return_msg);
        setHoldings([]);
        setTotalValue(0);
        setTotalProfitLoss(0);
        setTotalProfitLossRate(0);
        return;
      }

      const toNumber = (v?: string) => {
        if (!v) return 0;
        // 응답이 문자열 숫자이므로 안전 변환
        const n = Number(String(v).replace(/,/g, ""));
        return Number.isNaN(n) ? 0 : n;
      };

      const items = response.acnt_evlt_remn_indv_tot ?? [];

      const mapped = items.map((item) => {
        const quantity = toNumber(item.rmnd_qty);
        const currentPrice = toNumber(item.cur_prc || item.pred_close_pric);
        const averagePrice = toNumber(item.pur_pric);
        const totalValue = toNumber(item.evlt_amt);
        const profitLoss = toNumber(item.evltv_prft);
        const profitLossRate = toNumber(item.prft_rt);

        return {
          code: item.stk_cd,
          name: item.stk_nm,
          quantity,
          averagePrice,
          currentPrice,
          totalValue,
          profitLoss,
          profitLossRate,
          // 시가총액 정보는 응답에 없어 0으로 설정
          marketValue: 0,
        } as HoldingStock;
      });

      // 합계 계산 (API가 제공하면 사용, 없으면 계산)
      const apiTotalValue = toNumber(response.tot_evlt_amt);
      const apiTotalProfitLoss = toNumber(response.tot_evlt_pl);
      const apiTotalProfitLossRate = toNumber(response.tot_prft_rt);

      const calcTotalValue = mapped.reduce((sum, s) => sum + s.totalValue, 0);
      const calcTotalProfitLoss = mapped.reduce(
        (sum, s) => sum + s.profitLoss,
        0
      );
      const calcTotalProfitLossRate =
        calcTotalValue !== 0
          ? (calcTotalProfitLoss / (calcTotalValue - calcTotalProfitLoss)) * 100
          : 0;

      setHoldings(mapped);
      setTotalValue(apiTotalValue || calcTotalValue);
      setTotalProfitLoss(apiTotalProfitLoss || calcTotalProfitLoss);
      setTotalProfitLossRate(apiTotalProfitLossRate || calcTotalProfitLossRate);
    } catch (error) {
      console.error("보유 종목 조회 실패:", error);
      // 에러 시 빈 배열로 설정
      setHoldings([]);
      setTotalValue(0);
      setTotalProfitLoss(0);
      setTotalProfitLossRate(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

  const handleStockClick = (stock: HoldingStock) => {
    setStock({ code: stock.code, name: stock.name });
    setPage("stock-detail");
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ko-KR").format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">보유 종목을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 - 총 평가금액 및 손익 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border">
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-2">📊 보유 종목</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">총 평가금액</div>
              <div className="text-xl font-bold text-gray-800">
                {formatNumber(totalValue)}원
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">총 손익</div>
              <div
                className={`text-xl font-bold flex items-center justify-center ${
                  totalProfitLoss >= 0 ? "text-red-500" : "text-blue-500"
                }`}
              >
                {totalProfitLoss >= 0 ? (
                  <TrendingUp className="w-5 h-5 mr-1" />
                ) : (
                  <TrendingDown className="w-5 h-5 mr-1" />
                )}
                {formatNumber(totalProfitLoss)}원
              </div>
              <div
                className={`text-sm ${
                  totalProfitLossRate >= 0 ? "text-red-500" : "text-blue-500"
                }`}
              >
                {formatPercentage(totalProfitLossRate)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 보유 종목 목록 */}
      <div className="flex-1 overflow-y-auto">
        {holdings.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">보유 종목이 없습니다</p>
            <p className="text-gray-400 text-sm mt-2">
              종목을 검색하여 매수해보세요
            </p>
            <button
              onClick={() => setPage("stock-data")}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              종목 검색하기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {holdings.map((stock) => (
              <HoldingItem
                key={stock.code}
                stock={stock}
                onClick={() => handleStockClick(stock)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface HoldingItemProps {
  stock: HoldingStock;
  onClick: () => void;
}

const HoldingItem = ({ stock, onClick }: HoldingItemProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ko-KR").format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-lg">{stock.name}</h3>
          <p className="text-sm text-gray-500">{stock.code}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-800">
            {formatNumber(stock.currentPrice)}원
          </div>
          <div
            className={`text-sm flex items-center justify-end ${
              stock.profitLoss >= 0 ? "text-red-500" : "text-blue-500"
            }`}
          >
            {stock.profitLoss >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {formatPercentage(stock.profitLossRate)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-500 mb-1">보유 수량</div>
          <div className="font-semibold">{stock.quantity}주</div>
        </div>
        <div>
          <div className="text-gray-500 mb-1">평균 단가</div>
          <div className="font-semibold">
            {formatNumber(stock.averagePrice)}원
          </div>
        </div>
        <div>
          <div className="text-gray-500 mb-1">평가금액</div>
          <div className="font-semibold">
            {formatNumber(stock.totalValue)}원
          </div>
        </div>
        <div>
          <div className="text-gray-500 mb-1">손익</div>
          <div
            className={`font-semibold ${
              stock.profitLoss >= 0 ? "text-red-500" : "text-blue-500"
            }`}
          >
            {formatNumber(stock.profitLoss)}원
          </div>
        </div>
      </div>
    </div>
  );
};

export default Holdings;
