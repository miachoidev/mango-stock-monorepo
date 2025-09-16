"use client";
import { kiwoomLogin } from "@/utils/api/kiwoom-login";
import React from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Search, Star } from "lucide-react";
import { ShoppingCart, TrendingUp } from "lucide-react";
import Link from "next/link";

const Main = () => {
  const list = [
    {
      title: "검색",
      // onClick: () => router.push("/stock/stock-data"),
      href: "/stock/stock-data",
      icon: <Search className="w-4 h-4" />,
    },
    {
      title: "보유 종목",
      // onClick: () => router.push("/stock/holdings"),
      href: "/stock/holdings",
      icon: <ShoppingCart className="w-4 h-4" />,
    },
    {
      title: "관심 목록",
      // onClick: () => router.push("/stock/watchlist"),
      href: "/stock/watchlist",
      icon: <Star className="w-4 h-4" />,
    },
    {
      title: "일별잔고",
      // onClick: () => router.push("/stock/daily-balance"),
      href: "/stock/daily-balance",
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  const handleLogin = async () => {
    const token = await kiwoomLogin();
    if (token) {
      Cookies.set("token", token);
      toast.success("로그인 성공");
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* 헤더 섹션 */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📈 주식 투자</h1>
      </div>

      {/* 메뉴 버튼 섹션 */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-3 max-w-[320px] mx-auto">
          {list.map((item) => (
            <MainItem
              key={item.title}
              title={item.title}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      {/* 푸터 */}
      <div className="text-center p-4 absolute bottom-0 left-0 right-0">
        <p className="text-xs text-gray-400">
          💡 현명한 투자는 정보에서 시작됩니다
        </p>
        <Button variant="outline" className="w-full mt-4" onClick={handleLogin}>
          로그인
        </Button>
      </div>
    </div>
  );
};

const MainItem = ({
  title,
  icon,
  href,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
}) => {
  const getButtonStyle = (title: string) => {
    if (title.includes("검색"))
      return "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200";
    if (title.includes("보유"))
      return "bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200";
    if (title.includes("관심"))
      return "bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-200";
    if (title.includes("잔고"))
      return "bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200";
    return "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700";
  };

  return (
    <Link
      className={`font-semibold cursor-pointer p-4 rounded-xl min-w-[140px] h-[70px] flex items-center justify-center shadow-md text-gray-800 hover:shadow-xl transition-all duration-200 hover:scale-102 border-1 border-gray-100  ${getButtonStyle(
        title
      )}`}
      href={href}
    >
      <span className="text-center text-sm flex items-center justify-center gap-2">
        {title}
        {icon}
      </span>
    </Link>
  );
};

export default Main;
