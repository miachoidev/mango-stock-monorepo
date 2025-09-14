import { useStockPage } from "@/hooks/use-stock-page";
import { kiwoomLogin } from "@/utils/api/kiwoom-login";
import React from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";

const Main = () => {
  const { setPage } = useStockPage();

  const list = [
    { title: "검색 🔎", onClick: () => setPage("stock-data") },
    { title: "관심 목록 ⭐", onClick: () => setPage("watchlist") },
    { title: "일별잔고수익률", onClick: () => setPage("daily-balance") },
    { title: "로그인", onClick: () => handleLogin() },
  ];

  const handleLogin = async () => {
    const token = await kiwoomLogin();
    if (token) {
      Cookies.set("token", token);
      toast.success("로그인 성공");
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 헤더 섹션 */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📈 주식 투자</h1>
      </div>

      {/* 메뉴 버튼 섹션 */}
      <div className="px-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          주요 기능
        </h2>
        <div className="grid grid-cols-2 gap-3 max-w-[320px] mx-auto">
          {list.map((item) => (
            <MainItem
              key={item.title}
              title={item.title}
              onClick={item.onClick}
            />
          ))}
        </div>
      </div>

      {/* 푸터 */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">
          💡 현명한 투자는 정보에서 시작됩니다
        </p>
      </div>
    </div>
  );
};

const MainItem = ({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) => {
  const getButtonStyle = (title: string) => {
    if (title.includes("검색"))
      return "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700";
    if (title.includes("관심"))
      return "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600";
    if (title.includes("잔고"))
      return "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700";
    if (title.includes("로그인"))
      return "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700";
    return "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700";
  };

  return (
    <div
      className={`font-semibold cursor-pointer p-4 rounded-xl min-w-[140px] h-[70px] flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 ${getButtonStyle(
        title
      )}`}
      onClick={onClick}
    >
      <span className="text-center text-sm">{title}</span>
    </div>
  );
};

export default Main;
