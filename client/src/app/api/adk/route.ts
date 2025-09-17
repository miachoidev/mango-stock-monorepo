import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, session_id } = body;
    const requestBody = {
      user_id: "stock_user",
      message: message,
    } as {
      user_id: string;
      message: string;
      session_id?: string;
      instruction?: string;
    };

    if (session_id) {
      requestBody.session_id = session_id;
    }

    const kiwoomToken = request.cookies.get("token")?.value;

    const response = await fetch(`http://localhost:8000/api/v1/adk/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        KIWOOM_TOKEN: kiwoomToken || "",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("채팅 API 호출 오류:", error);
    throw error;
  }
}
