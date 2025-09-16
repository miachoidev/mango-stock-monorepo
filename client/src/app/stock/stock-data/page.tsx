"use client";

import React, { useState, useEffect, useMemo } from "react";
import { STOCK_DATA_API } from "@/utils/api/stock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, HeartIcon, Search, RotateCcw } from "lucide-react";
import { WISHLIST_API } from "@/utils/api/wishlist.api";
import { StockItem } from "@/types/stock";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      // 검색어가 없으면 전체 데이터
      const { data, total } = STOCK_DATA_API.getStockData(1, itemsPerPage);
      setFilteredData(data);
      setTotalCount(total);
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

  // 초기화 기능
  const handleReset = () => {
    setSearchTerm("");
    setCurrentPage(1);
    const { data, total } = STOCK_DATA_API.getStockData(1, itemsPerPage);
    setFilteredData(data);
    setTotalCount(total);
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

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    const { data, total } = STOCK_DATA_API.getStockData(1, itemsPerPage);
    setFilteredData(data);
    setTotalCount(total);
  }, []);

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalCount);

  const handleStockClick = (stock: StockItem) => {
    // Next.js 라우터를 사용하여 페이지 이동
    window.location.href = `/stock/stock-detail?code=${
      stock.code
    }&name=${encodeURIComponent(stock.name)}`;
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col p-6 w-full">
      {/* 헤더 */}
      <div className="mb-2">
        <div className="p-2">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-4 h-4 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-800">종목 검색</h1>
          </div>

          {/* 검색 바 */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="종목명 또는 종목코드를 입력하세요..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-blue-300 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 주식 리스트 */}
      <>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">종목 목록</h2>
        <div className="space-y-3">
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
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-2xl">
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

const StockDataItem = ({
  stock,
  handleStockClick,
}: {
  stock: StockItem;
  handleStockClick: (stock: StockItem) => void;
}) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const isFavorite = (code: string) => {
      return wishlist.some((item: StockItem) => item.code === code) as boolean;
    };
    setLiked(isFavorite(stock.code));
  }, [stock]);

  const handleFavorite = (stock: StockItem) => {
    if (liked) {
      WISHLIST_API.removeWishlist({ code: stock.code, name: stock.name });
    } else {
      WISHLIST_API.addWishlist({ code: stock.code, name: stock.name });
    }
    setLiked(!liked);
  };

  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => handleStockClick(stock)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {stock.name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {stock.name}
          </div>
          <div className="text-xs text-gray-500">{stock.code}</div>
        </div>
      </div>

      <div
        className="p-2 rounded-full hover:bg-red-50 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          handleFavorite(stock);
        }}
      >
        {liked ? (
          <HeartIcon
            fill="#ef4444"
            className="w-5 h-5 cursor-pointer text-red-500"
          />
        ) : (
          <Heart className="w-5 h-5 cursor-pointer text-gray-400 hover:text-red-500 transition-colors" />
        )}
      </div>
    </div>
  );
};

export default StockData;
