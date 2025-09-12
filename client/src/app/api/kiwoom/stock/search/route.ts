import { axiosInstance } from "@/app/api/setting/api";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();
  const { stk_cd } = body;

  // 쿠키에서 토큰 가져오기
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "토큰이 없습니다" }, { status: 401 });
  }

  const response = await axiosInstance.post(
    `/dostk/sect`,
    {
      mrkt_tp: "0",
      inds_cd: "001",
    },
    {
      headers: {
        "api-id": "ka20001",
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "cont-yn": "Y",
        "next-key": "0",
      },
    }
  );

  const data = await response.data;
  return NextResponse.json(data);
}
