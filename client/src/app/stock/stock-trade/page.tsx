"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StockChartDay } from "@/types/kioom";
import {
  KIWOOM_TRADING_API,
  TradingRequest,
} from "@/utils/api/kiwoom-trading.api";
import { KIOOM_API } from "@/utils/api/kiwoom.api";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  ArrowLeft,
  TrendingDown,
  Minus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function StockTrade() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const name = searchParams.get("name") || "";
  const type = searchParams.get("type") || "buy";

  const [priceType, setPriceType] = useState<"market" | "limit">("market");
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [isTrading, setIsTrading] = useState(false);
  const [tradeType, setTradeType] = useState<"buy" | "sell">(
    type as "buy" | "sell"
  );

  const { data, isLoading, error } = useQuery<StockChartDay[]>({
    queryKey: ["stockChart", code, "week"],
    queryFn: () => KIOOM_API.getStockChartWeek(code),
    enabled: !!code,
  });

  // 데이터 정리 및 포맷팅 (주봉 데이터만)
  const chartData = useMemo(() => {
    if (!data) return [];

    const processedData = data.map((item, index) => {
      // 가격 데이터 정리 (음수인 경우 절댓값으로 변환)
      const cleanPrice = (price: string) => {
        const numPrice = parseInt(price);
        return numPrice < 0 ? Math.abs(numPrice) : numPrice;
      };

      // 시간 포맷팅 (주봉용)
      const formatTime = (timeStr: string) => {
        if (!timeStr) return `주봉 ${index + 1}`;

        // dt 사용 (YYYYMMDD)
        const month = timeStr.substring(4, 6);
        const day = timeStr.substring(6, 8);
        return `${month}/${day}`;
      };

      // 주봉 데이터의 dt 필드 사용
      const timeField = item.dt;

      return {
        time: formatTime(timeField),
        price: cleanPrice(item.cur_prc),
        volume: parseInt(item.trde_qty),
        open: cleanPrice(item.open_pric),
        high: cleanPrice(item.high_pric),
        low: cleanPrice(item.low_pric),
        originalData: item,
        // 정렬을 위한 타임스탬프 추가
        timestamp: timeField,
      };
    });

    // 시간순으로 정렬 (오래된 것부터 최신 순)
    return processedData.sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return a.timestamp.localeCompare(b.timestamp);
      }
      return 0;
    });
  }, [data]);

  const currentPriceInfo = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;

    const latestData = chartData[chartData.length - 1];
    const previousData = chartData[chartData.length - 2];

    if (!latestData) return null;

    const currentPrice = latestData.price;
    const previousPrice = previousData ? previousData.price : currentPrice;
    const change = currentPrice - previousPrice;
    const changePercent =
      previousPrice !== 0 ? (change / previousPrice) * 100 : 0;

    return {
      currentPrice,
      change,
      changePercent,
      isUp: change > 0,
      isDown: change < 0,
      isFlat: change === 0,
    };
  }, [chartData]);

  // 현재 가격으로 price 초기화
  useEffect(() => {
    if (currentPriceInfo?.currentPrice && priceType === "limit") {
      setPrice(currentPriceInfo.currentPrice);
    }
  }, [currentPriceInfo, priceType]);

  // 매도/매수 주문 처리
  const handleTrade = async () => {
    if (!currentPriceInfo) {
      toast.error("가격 정보를 불러올 수 없습니다.");
      return;
    }

    if (quantity <= 0) {
      toast.error("수량을 올바르게 입력해주세요.");
      return;
    }

    if (priceType === "limit" && price <= 0) {
      toast.error("가격을 올바르게 입력해주세요.");
      return;
    }

    const orderRequest: TradingRequest = {
      dmst_stex_tp: "KRX",
      stk_cd: code,
      ord_qty: quantity.toString(),
      ord_uv:
        priceType === "market"
          ? currentPriceInfo.currentPrice.toString()
          : price.toString(),
      trde_tp: priceType === "market" ? "3" : "0", // 03: 시장가, 00: 지정가
    };

    setIsTrading(true);

    try {
      const response =
        tradeType === "buy"
          ? await KIWOOM_TRADING_API.buyStock(orderRequest)
          : await KIWOOM_TRADING_API.sellStock(orderRequest);
      console.log("주문 응답:", response);

      if (response.return_code === 0) {
        toast.success(response.return_msg);
        // 입력값 초기화
        setQuantity(1);
        if (priceType === "limit") {
          setPrice(currentPriceInfo.currentPrice);
        }
      } else {
        toast.error(response.return_msg);
      }
    } catch (error) {
      toast.error("주문 처리 중 오류가 발생했습니다.");
    } finally {
      setIsTrading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-lg">차트 데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-lg text-red-500">
          차트 데이터를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-lg text-gray-500">차트 데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <section className="bg-[#19212A] rounded-xl p-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold text-white">{name}</div>
              <span className="text-xs text-gray-300">{code}</span>
            </div>

            {/* 현재 가격 정보 */}
            {currentPriceInfo && (
              <div className="flex items-center mt-1 gap-4">
                <div className="text-lg font-bold text-white">
                  {currentPriceInfo.currentPrice.toLocaleString()}원
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    currentPriceInfo.isUp
                      ? "text-red-500"
                      : currentPriceInfo.isDown
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  {currentPriceInfo.isUp && <TrendingUp className="w-5 h-5" />}
                  {currentPriceInfo.isDown && (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  {currentPriceInfo.isFlat && <Minus className="w-5 h-5" />}
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium flex items-center gap-1">
                      {currentPriceInfo.change >= 0 ? "+" : ""}
                      {currentPriceInfo.change.toLocaleString()}원
                    </span>
                    <span className="text-xs font-medium">
                      ({currentPriceInfo.changePercent >= 0 ? "+" : ""}
                      {currentPriceInfo.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="mt-6 rounded-2xl bg-[#19212A]">
        <div className="p-6">
          {/* 매수/매도 탭 */}
          <div className="flex bg-gray-700 rounded-xl p-1 mb-6">
            <button
              onClick={() => setTradeType("buy")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                tradeType === "buy"
                  ? "bg-red-500 text-white shadow-lg"
                  : "text-gray-100 hover:bg-gray-600"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              매수
            </button>
            <button
              onClick={() => setTradeType("sell")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                tradeType === "sell"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-gray-100 hover:bg-gray-600"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              매도
            </button>
          </div>

          {/* 주문 유형 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-100 mb-2">
              주문 유형
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setPriceType("market")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  priceType === "market"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-100 hover:bg-gray-500"
                }`}
              >
                시장가
              </button>
              <button
                onClick={() => setPriceType("limit")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  priceType === "limit"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-100 hover:bg-gray-500"
                }`}
              >
                지정가
              </button>
            </div>
          </div>

          {/* 입력 필드들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">
                수량 (주)
              </label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                className="text-center font-semibold bg-gray-700 border-none text-white w-20"
                placeholder="수량을 입력하세요"
              />
            </div>

            {priceType === "limit" && (
              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  가격 (원)
                </label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min="1"
                  className="text-center font-semibold bg-gray-700 border-none text-white w-50"
                  placeholder="가격을 입력하세요"
                />
              </div>
            )}
          </div>

          {/* 예상 금액 */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">
                예상 {tradeType === "buy" ? "매수" : "매도"} 금액:
              </span>
              <span className="text-xl font-bold text-gray-900">
                {(
                  quantity *
                  (priceType === "market"
                    ? currentPriceInfo?.currentPrice || 0
                    : price)
                ).toLocaleString()}
                원
              </span>
            </div>
          </div>

          {/* 주문 버튼 */}
          <Button
            onClick={handleTrade}
            disabled={isTrading || !currentPriceInfo}
            className={`w-full h-12 font-bold text-lg gradient-button ${
              tradeType === "buy"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isTrading
              ? "주문 처리 중..."
              : `${tradeType === "buy" ? "매수" : "매도"} 주문하기`}
          </Button>

          {/* 주의사항 */}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          키움증권 OpenAPI를 통한 실제 거래 시스템입니다. 주문 전 신중히
          확인해주세요.
        </p>
      </div>
    </div>
  );
}
