"use client";

import React, { useState, useEffect } from "react";
import { STOCK_DATA_API } from "@/utils/api/stock-data";
import { Button } from "@/components/ui/button";
import { Heart, HeartIcon, Search } from "lucide-react";
import { WISHLIST_API } from "@/utils/api/wishlist.api";
import { StockItem } from "@/types/stock";
import { StockDataItem } from "@/components/stock/stock-data-item";

const StockData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<StockItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // 검색 기능
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동

    if (term.trim() === "") {
      setFilteredData([]);
      setTotalCount(0);
    } else {
      // 검색어가 있으면 필터링
      const allData = STOCK_DATA_API.getStockData(1, 10000).data; // 전체 데이터 가져오기
      const filtered = allData.filter(
        (stock) => stock.name.includes(term) || stock.code.includes(term)
      );
      setFilteredData(filtered.slice(0, itemsPerPage));
      setTotalCount(filtered.length);
    }
  };

  // 페이지네이션
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    if (searchTerm.trim() === "") {
      // 검색어가 없으면 전체 데이터에서 페이지네이션
      const { data } = STOCK_DATA_API.getStockData(page, itemsPerPage);
      setFilteredData(data);
    } else {
      // 검색어가 있으면 필터링된 데이터에서 페이지네이션
      const allData = STOCK_DATA_API.getStockData(1, 10000).data;
      const filtered = allData.filter(
        (stock) =>
          stock.name.includes(searchTerm) || stock.code.includes(searchTerm)
      );
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setFilteredData(filtered.slice(startIndex, endIndex));
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleStockClick = (stock: StockItem) => {
    // Next.js 라우터를 사용하여 페이지 이동
    window.location.href = `/stock/stock-detail?code=${
      stock.code
    }&name=${encodeURIComponent(stock.name)}`;
  };

  const famousStock = [
    { code: "005930", name: "삼성전자" },
    { code: "000660", name: "SK하이닉스" },
    { code: "005380", name: "현대차" },
    { code: "000270", name: "기아" },
  ];

  return (
    <div className="h-full w-full">
      {/* 검색 바 */}
      <div className="flex gap-3 w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            placeholder="종목명 또는 종목코드를 입력하세요..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12 rounded-full bg-[#304A63] border-none text-white focus:outline-none placeholder:text-gray-300 w-full"
          />
        </div>
      </div>

      {filteredData.length === 0 && searchTerm.trim() !== "" && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">검색 결과가 없습니다.</p>
        </div>
      )}
      {filteredData.length === 0 && searchTerm.trim() === "" && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-white mb-4">인기 주식</h2>
          {famousStock.map((stock) => (
            <StockDataItem
              key={stock.code}
              stock={stock}
              handleStockClick={handleStockClick}
            />
          ))}
        </div>
      )}

      {/* 주식 리스트 */}
      <>
        <div className="space-y-0">
          {filteredData.map((stock) => (
            <StockDataItem
              key={stock.code}
              stock={stock}
              handleStockClick={handleStockClick}
            />
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="border-t px-6 py-4">
            <div className="flex items-center justify-center">
              <nav className="flex items-center gap-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                >
                  이전
                </Button>

                {/* 페이지 번호들 */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={
                        currentPage === pageNum
                          ? "bg-blue-500 hover:bg-blue-600 border-blue-500"
                          : "border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                >
                  다음
                </Button>
              </nav>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default StockData;
