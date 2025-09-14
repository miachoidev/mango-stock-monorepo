import { useStockPage } from "@/hooks/use-stock-page";
import { StockChartDay } from "@/types/kioom";
import { KIOOM_API } from "@/utils/api/kiwoom.api";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

const StockDetail = () => {
  const { stock, setPage, setTradeType } = useStockPage();

  // 매도/매수 상태

  const { data, isLoading, error } = useQuery<StockChartDay[]>({
    queryKey: ["stockChart", stock.code, "week"],
    queryFn: () => KIOOM_API.getStockChartWeek(stock.code),
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

  if (isLoading) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-lg">차트 데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-lg text-red-500">
          차트 데이터를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-lg text-gray-500">차트 데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col p-6 w-full">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-xl font-bold text-gray-800">{stock.name}</div>
            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-600 font-medium">
              {stock.code}
            </span>
          </div>

          {/* 현재 가격 정보 */}
          {currentPriceInfo && (
            <div className="space-y-4 flex flex-col items-start justify-center">
              <div className="text-xl font-bold text-gray-900">
                {currentPriceInfo.currentPrice.toLocaleString()}원
              </div>
              <div
                className={`flex items-center gap-2 rounded-md ${
                  currentPriceInfo.isUp
                    ? "text-red-600"
                    : currentPriceInfo.isDown
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                {currentPriceInfo.isUp && <TrendingUp className="w-6 h-6" />}
                {currentPriceInfo.isDown && (
                  <TrendingDown className="w-6 h-6" />
                )}
                {currentPriceInfo.isFlat && <Minus className="w-6 h-6" />}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold flex items-center gap-1">
                    {currentPriceInfo.change >= 0 ? "+" : ""}
                    {currentPriceInfo.change.toLocaleString()}원
                  </span>
                  <span className="text-sm font-semibold">
                    ({currentPriceInfo.changePercent >= 0 ? "+" : ""}
                    {currentPriceInfo.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 차트 컨테이너 */}
      <div className="w-full flex gap-4">
        <Button
          className="flex-1 bg-red-500"
          onClick={() => {
            setPage("stock-trade");
            setTradeType("buy");
          }}
        >
          매수
        </Button>
        <Button
          className="flex-1 bg-blue-500"
          onClick={() => {
            setPage("stock-trade");
            setTradeType("sell");
          }}
        >
          매도
        </Button>
      </div>
      <div className="w-full">
        {/* 가격 차트 */}
        <div className="w-full min-h-0">
          <div className="h-[450px] w-full mt-5">
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
                  height={200}
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
    </div>
  );
};

export default StockDetail;
