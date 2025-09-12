"use client";

import { KIOOM_API } from "@/utils/api/kioom";
import { StockInfo } from "@/types/kioom";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const StockSearch = () => {
  const [searchCode, setSearchCode] = useState("");
  const [searchResult, setSearchResult] = useState<StockInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      alert("종목코드를 입력해주세요");
      return;
    }

    setIsSearching(true);
    try {
      const result = await KIOOM_API.searchStock(searchCode.trim());
      setSearchResult(result);
    } catch (error) {
      console.error("종목 검색 오류:", error);
      alert("종목 검색 중 오류가 발생했습니다");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const popularStocks = [
    {
      code: "005930",
      name: "삼성전자",
    },
    {
      code: "000660",
      name: "SK하이닉스",
    },
    {
      code: "035420",
      name: "NAVER",
    },
    {
      name: "카카오",
      code: "035720",
    },
    {
      name: "LG화학",
      code: "003550",
    },
  ];

  return (
    <div className="h-full bg-white flex flex-col p-4">
      <div className="text-lg font-bold mb-4 text-center">종목 검색</div>

      {/* 검색 입력 */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="종목코드 입력 (예: 005930)"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isSearching} className="px-6">
          {isSearching ? "검색중..." : "검색"}
        </Button>
      </div>

      {/* 검색 결과 */}
      {searchResult && (
        <div className="flex-1 bg-gray-50 rounded-lg p-4">
          {searchResult.return_code === 0 ? (
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {searchResult.stk_nm}
                </h3>
                <p className="text-sm text-gray-600">{searchResult.stk_cd}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StockInfoItem
                  label="현재가"
                  value={`${Number(searchResult.cur_prc).toLocaleString()}원`}
                  className="text-lg font-bold"
                />
                <StockInfoItem
                  label="전일대비"
                  value={`${searchResult.prdy_vrss_sign}${Number(
                    searchResult.prdy_vrss
                  ).toLocaleString()}원`}
                  className={
                    searchResult.prdy_vrss_sign === "+"
                      ? "text-red-500"
                      : "text-blue-500"
                  }
                />
                <StockInfoItem
                  label="등락률"
                  value={`${searchResult.prdy_vrss_sign}${searchResult.prdy_ctrt}%`}
                  className={
                    searchResult.prdy_vrss_sign === "+"
                      ? "text-red-500"
                      : "text-blue-500"
                  }
                />
                <StockInfoItem
                  label="거래량"
                  value={`${Number(searchResult.acml_vol).toLocaleString()}주`}
                />
                <StockInfoItem
                  label="거래대금"
                  value={`${Number(
                    searchResult.acml_tr_pbmn
                  ).toLocaleString()}원`}
                />
                <StockInfoItem
                  label="시장구분"
                  value={
                    searchResult.mksc_shrn_iscd === "001" ? "코스피" : "코스닥"
                  }
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-red-500">
              <p>검색 결과가 없습니다</p>
              <p className="text-sm">{searchResult.return_msg}</p>
            </div>
          )}
        </div>
      )}

      {/* 인기 종목 추천 */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">인기 종목</h4>
        <div className="flex flex-wrap gap-2">
          {popularStocks.map((stock) => (
            <Button
              key={stock.code}
              variant="outline"
              size="sm"
              onClick={() => setSearchCode(stock.code)}
              className="text-xs"
            >
              {stock.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const StockInfoItem = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) => {
  return (
    <div className="bg-white rounded p-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-sm font-medium ${className}`}>{value}</div>
    </div>
  );
};

export default StockSearch;
