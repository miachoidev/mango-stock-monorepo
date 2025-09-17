"use client";
import { kiwoomLogin } from "@/utils/api/kiwoom-login";
import React from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LucideRocket, Search, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import HoldingList from "@/components/page/holding/holding-list";

const Main = () => {
  const router = useRouter();

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
      <div className="flex justify-between pb-6 px-6">
        <div className="text-xl font-bold text-white">
          허들러 주식 투자 에이전트
        </div>
        <Button
          variant="ghost"
          onClick={handleLogin}
          className="text-gray-500 hover:bg-gray-800/10"
        >
          로그인
        </Button>
      </div>

      <div className="flex justify-between w-full px-6 gap-4">
        <MainItem onClick={() => router.push("/stock/stock-data")} />
        <MainItem2 onClick={() => router.push("/stock/watchlist")} />
      </div>
      <div className="w-full px-6 mt-4">
        <MainItem3 />
      </div>

      <div className="w-full px-6 mt-4">
        <HoldingList />
      </div>

      {/* <div className="text-center p-4 absolute bottom-0 left-0 right-0">
        <p className="text-xs text-gray-400">
          💡 현명한 투자는 정보에서 시작됩니다
        </p>
        <Button variant="outline" className="w-full mt-4" onClick={handleLogin}>
          로그인
        </Button>
      </div> */}
    </div>
  );
};

const MainItem = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="main-item-card" onClick={onClick}>
      <div className="main-item-card-inner">
        <div className="flex items-center justify-between h-8">
          <div className="text-xl font-semibold">검색</div>
          <div className="bg-[#35363D] rounded-full w-7 h-7 flex items-center justify-center">
            <Search className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-7">주식 검색</div>
        <div className="text-md text-white mt-1">인기 주식 & 인기 채권</div>
      </div>
    </div>
  );
};
const MainItem2 = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="main-item-card" onClick={onClick}>
      <div className="main-item-card-inner">
        <div className="flex items-center justify-between h-8">
          <div className="text-xl font-semibold">관심 목록</div>
          <div className="bg-[#35363D] rounded-full w-7 h-7 flex items-center justify-center">
            <Star className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-7">주식 골라보기</div>
        <div className="text-md text-white mt-1">관심 목록 관리</div>
      </div>
    </div>
  );
};

const MainItem3 = () => {
  return (
    <div className="w-full bg-[#19212A] rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between h-10">
        <div className="text-xl font-semibold">종목 추천</div>
        <div className="bg-[#35363D] rounded-full w-7 h-7 flex items-center justify-center">
          <LucideRocket className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="text-sm text-gray-400 mt-6">AI Agent 추천 종목</div>

      <Button className="w-full mt-4 bg-gradient-to-r from-[#fa6eff] to-[#313fd3] rounded-full hover:bg-gradient-to-r hover:from-[#fa6eff]/80 hover:to-[#313fd3]/80">
        추천 받기
      </Button>
    </div>
  );
};

export default Main;
