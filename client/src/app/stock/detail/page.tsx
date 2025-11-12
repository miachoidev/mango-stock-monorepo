"use client";

import { StockChartDay } from "@/types/kioom";
import { KIOOM_API } from "@/utils/api/kiwoom.api";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Rocket,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";
import { useRouter, useSearchParams } from "next/navigation";
import { STOCK_TEMPLATE } from "@/utils/template";

const StockDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const name = searchParams.get("name") || "";

  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");

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

  // 현재 가격 정보 계산
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

  const { onSubmit } = useChat();

  const onClickAnalyzeStock = () => {
    const newMessage = STOCK_TEMPLATE.aiTemplate(name, code);
    onSubmit(newMessage);
  };

  const onClickInvestAdvice = () => {
    const newMessage = STOCK_TEMPLATE.investAdviceTemplate(name, code);
    onSubmit(newMessage);
  };

  const handleTrade = (type: "buy" | "sell") => {
    setTradeType(type);
    router.push(
      `/stock/stock-trade?code=${code}&name=${encodeURIComponent(
        name
      )}&type=${type}`
    );
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
    <div className="h-full flex flex-col w-full">
      {/* 헤더 */}
      <section>
        <div>
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold text-white">{name}</div>
            <span className="text-xs text-gray-300">{code}</span>
          </div>

          {/* 현재 가격 정보 */}
          {currentPriceInfo && (
            <div className="flex flex-col items-start justify-center mt-2">
              <div className="text-3xl font-bold text-white">
                {currentPriceInfo.currentPrice.toLocaleString()}원
              </div>
              <div
                className={`flex items-center gap-2 mt-1 ${
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
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium flex items-center gap-1">
                    {currentPriceInfo.change >= 0 ? "+" : ""}
                    {currentPriceInfo.change.toLocaleString()}원
                  </span>
                  <span className="text-sm font-medium">
                    ({currentPriceInfo.changePercent >= 0 ? "+" : ""}
                    {currentPriceInfo.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="w-full">
        {/* 가격 차트 */}
        <div className="w-full min-h-0">
          <div className="h-[400px] w-full mt-5">
            <ResponsiveContainer>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={140}
                  type="category"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={["0", "dataMax + 10000"]}
                  type="number"
                />
                <Tooltip
                  formatter={(value: unknown, name: string) => [
                    `${(value as number).toLocaleString()}원`,
                    name === "price" ? "현재가" : name,
                  ]}
                  labelFormatter={(label) => `시간: ${label}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#fe5d39"
                  strokeWidth={1}
                  dot={false}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <section className="w-full">
        <div
          className="w-full mt-4 bg-gradient-to-r from-[#ffcd48] to-[#ff9d24] hover:from-[#ffcd48]/80 hover:to-[#ff9d24]/80 h-16 rounded-[24px] p-4 flex items-center justify-between cursor-pointer"
          onClick={() => {
            onClickAnalyzeStock();
          }}
        >
          <div className="flex items-center justify-center gap-5">
            <div className="flex items-center justify-center p-2 rounded-full bg-[#ffeab2]">
              <Rocket className="w-4 h-4 text-black" />
            </div>
            <div className="flex flex-col items-start justify-center">
              <div className="text-black text-md font-semibold">AI 분석</div>
              <div className="text-gray-700 text-xs">
                망고 스탁 주식 투자 에이전트 분석
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center bg-[#ffeab2] p-2 rounded-full">
            <ChevronRight className="w-4 h-4 text-black" />
          </div>
        </div>
        <div
          className="w-full mt-4 bg-gradient-to-r from-[#1C306D] to-[#1C63A9] hover:from-[#1C306D]/80 hover:to-[#1C63A9]/80 h-16 rounded-[24px] p-4 flex items-center justify-between cursor-pointer"
          onClick={() => {
            onClickInvestAdvice();
          }}
        >
          <div className="flex items-center justify-center gap-5">
            <div className="flex items-center justify-center p-2 rounded-full bg-[#457AB6]">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col items-start justify-center">
              <div className="text-white text-md font-semibold">투자 조언</div>
            </div>
          </div>
          <div className="flex items-center justify-center bg-[#457AB6] p-2 rounded-full">
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </section>

      {/* 차트 컨테이너 */}
      <section className="w-full flex gap-4 mt-8">
        <Button
          className="flex-1 bg-red-500 h-12"
          onClick={() => handleTrade("buy")}
        >
          매수
        </Button>
        <Button
          className="flex-1 bg-blue-500 h-12"
          onClick={() => handleTrade("sell")}
        >
          매도
        </Button>
      </section>
    </div>
  );
};

export default StockDetail;
