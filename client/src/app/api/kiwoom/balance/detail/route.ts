import { axiosInstance, KIOOM_API_HEADER_KEY } from "@/app/api/setting/api";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  // 쿠키에서 토큰 가져오기
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  console.log("token :", token);

  if (!token) {
    return NextResponse.json({ error: "토큰이 없습니다" }, { status: 401 });
  }

  const response = await axiosInstance.post(
    `/dostk/acnt`,
    { stex_tp: "0" },
    {
      headers: {
        "api-id": KIOOM_API_HEADER_KEY["일별잔고수익률"],
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "cont-yn": "Y",
        "next-key": "0",
      },
    }
  );

  console.log(response);

  const data = await response.data;
  return NextResponse.json(data);
}
