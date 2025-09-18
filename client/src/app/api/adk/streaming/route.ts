import { NextRequest, NextResponse } from "next/server";

// POST /api/adk/chat/sse - SSE 스트리밍 채팅 프록시
export const POST = async (request: NextRequest) => {
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
    };
    if (session_id) {
      requestBody.session_id = session_id;
    }

    const kiwoomToken = request.cookies.get("token")?.value;

    // ADK 서버로 SSE 요청 보내기
    const upstream = await fetch(
      `http://localhost:8000/api/v1/adk/chat/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          KIWOOM_TOKEN: kiwoomToken || "",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!upstream.ok || !upstream.body) {
      return new Response("Failed to connect to upstream SSE", { status: 502 });
    }

    // 스트림을 클라이언트로 그대로 전달
    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error?.response?.data || error?.message || "Internal Server Error",
        details: error?.response?.data || error,
      },
      { status: error?.response?.status || error?.status || 500 }
    );
  }
};
