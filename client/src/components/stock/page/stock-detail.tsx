import { useStockPage } from "@/hooks/use-stock-page";
import { StockChart, StockChartDay } from "@/types/kioom";
import { KIOOM_API } from "@/utils/api/kiwoom.api";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

const StockDetail = () => {
  const { stock } = useStockPage();
  const [chartType, setChartType] = useState<"minute" | "day" | "week">("week");

  const { data, isLoading, error } = useQuery<StockChartDay[] | StockChart[]>({
    queryKey: ["stockChart", stock.code, chartType],
    queryFn: () =>
      chartType === "minute"
        ? KIOOM_API.getStockChart(stock.code, 5)
        : chartType === "day"
        ? KIOOM_API.getStockChartDay(stock.code)
        : KIOOM_API.getStockChartWeek(stock.code),
  });

  // 데이터 정리 및 포맷팅
  const chartData = useMemo(() => {
    if (!data) return [];

    const processedData = data.map((item, index) => {
      // 가격 데이터 정리 (음수인 경우 절댓값으로 변환)
      const cleanPrice = (price: string) => {
        const numPrice = parseInt(price);
        return numPrice < 0 ? Math.abs(numPrice) : numPrice;
      };

      // 시간 포맷팅
      const formatTime = (timeStr: string) => {
        if (!timeStr)
          return chartType === "minute"
            ? `분봉 ${index + 1}`
            : `일봉 ${index + 1}`;

        if (chartType === "minute") {
          // 분봉: cntr_tm 사용 (YYYYMMDDHHMMSS)
          const hour = timeStr.substring(8, 10);
          const minute = timeStr.substring(10, 12);
          return `${hour}:${minute}`;
        } else {
          // 일봉: dt 사용 (YYYYMMDD)
          const year = timeStr.substring(0, 4);
          const month = timeStr.substring(4, 6);
          const day = timeStr.substring(6, 8);
          return `${month}/${day}`;
        }
      };

      // 시간 필드 선택
      const timeField =
        chartType === "minute"
          ? (item as StockChart).cntr_tm
          : chartType === "day"
          ? (item as StockChartDay).dt
          : (item as StockChartDay).dt;

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
  }, [data, chartType]);

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
    <div className="h-full bg-white flex flex-col p-4 w-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold">{stock.name}</div>
          <span className="text-sm text-gray-600">{stock.code}</span>
        </div>

        {/* 차트 타입 전환 버튼 */}
      </div>
      <div className="flex gap-2">
        <Button
          variant={chartType === "minute" ? "default" : "outline"}
          onClick={() => setChartType("minute")}
          size="sm"
        >
          분봉
        </Button>
        <Button
          variant={chartType === "day" ? "default" : "outline"}
          onClick={() => setChartType("day")}
          size="sm"
        >
          일봉
        </Button>
        <Button
          variant={chartType === "week" ? "default" : "outline"}
          onClick={() => setChartType("week")}
          size="sm"
        >
          주봉
        </Button>
      </div>

      {/* 차트 컨테이너 */}
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
