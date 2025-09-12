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
      router.push("/chat");
    }
  };
  return (
    <div className="flex w-full h-[100vh] justify-center items-center">
      {/* <Link href="/chat">Chat</Link> */}
      <button
        className="bg-purple-500 text-white p-5 rounded-md text-2xl font-bold"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}
