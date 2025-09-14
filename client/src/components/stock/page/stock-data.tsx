"use client";

import React, { useState, useEffect, useMemo } from "react";
import { STOCK_DATA_API } from "@/utils/api/stock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, HeartIcon, HeartPlus, HeartPulse } from "lucide-react";
import { WISHLIST_API } from "@/utils/api/wishlist.api";
import { StockItem } from "@/types/stock";
import { useRouter } from "next/navigation";
import { useStockPage } from "@/hooks/use-stock-page";

const StockData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<StockItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const { setPage, setStock } = useStockPage();

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
    setPage("stock-detail");
    setStock(stock);
  };

  return (
    <div className="p-2 max-w-6xl mx-auto bg-gray-100">
      <div className="mb-6">
        <div className="flex mb-4 items-center w-full justify-between gap-3">
          <Input
            placeholder="종목명, 종목코드로 검색..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full mr-2"
          />
          <Button onClick={handleReset}>초기화</Button>
        </div>

        {/* 검색 결과 정보 */}
        <div className="text-sm text-gray-600 mb-4">
          {searchTerm ? (
            <span>
              {searchTerm} 검색 결과: {totalCount}개 ({startIndex}-{endIndex}/{" "}
              {totalCount})
            </span>
          ) : (
            <span>
              전체 {totalCount}개 중 {startIndex}-{endIndex}개 표시
            </span>
          )}
        </div>
      </div>

      {/* 데이터 테이블 */}
      <div>
        <div className="flex flex-col w-full gap-2 h-[500px] overflow-y-auto pb-4">
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
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                이전
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                다음
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="rounded-l-md"
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
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        className="rounded-none"
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
                    className="rounded-r-md"
                  >
                    다음
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
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
  // const [isFavorite, setIsFavorite] = useState(selected);

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
      className="flex items-center justify-between w-full p-3 rounded-lg bg-white cursor-pointer"
      onClick={() => handleStockClick(stock)}
    >
      <div>{stock.name}</div>
      <div
        className="w-6 h-6"
        onClick={(e) => {
          e.stopPropagation();
          handleFavorite(stock);
        }}
      >
        {liked ? (
          <HeartIcon
            fill="red"
            className="w-6 h-6 cursor-pointer text-red-500"
          />
        ) : (
          <Heart className="w-6 h-6 cursor-pointer" />
        )}
      </div>
    </div>
  );
};

export default StockData;
