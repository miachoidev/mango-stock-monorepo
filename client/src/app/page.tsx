"use client";
import { kiwoomLogin } from "@/utils/api/kiwoom-login";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleLogin = async () => {
    const token = await kiwoomLogin();
    if (token) {
      Cookies.set("token", token);
      router.push("/stock");
    }
  };
  return (
    <div className="flex w-full h-[100vh] justify-center items-center bg-[#333] flex-col gap-4">
      {/* <Link href="/chat">Chat</Link> */}
      <div className="text-white text-4xl font-bold">망고 스톡</div>
      <button
        className="bg-yellow-500 text-gray-800 px-5 py-1 rounded-full text-xl font-semibold hover:bg-yellow-600"
        onClick={handleLogin}
      >
        시작하기
      </button>
    </div>
  );
}
