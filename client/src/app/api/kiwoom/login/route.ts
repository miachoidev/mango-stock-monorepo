import { NextResponse } from "next/server";

export async function POST() {
  // const host = "https://api.kiwoom.com";
  const host = "https://mockapi.kiwoom.com";
  const endpoint = "/oauth2/token";
  const url = host + endpoint;

  const headers = {
    "Content-Type": "application/json;charset=UTF-8",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        grant_type: "client_credentials",
        appkey: process.env.KIWOOM_APPKEY,
        secretkey: process.env.KIWOOM_SECRETKEY,
      }),
    });

    const responseHeaders = {
      "next-key": response.headers.get("next-key"),
      "cont-yn": response.headers.get("cont-yn"),
      "api-id": response.headers.get("api-id"),
    };

    console.log("code :", response.status);
    console.log("header :", JSON.stringify(responseHeaders, null, 4));

    const responseBody = await response.json();
    console.log("body :", JSON.stringify(responseBody, null, 4));

    return NextResponse.json({ token: responseBody.token });
  } catch (error) {
    console.error("요청 실패:", error);
    return NextResponse.json({ error: "로그인 요청 실패" }, { status: 500 });
  }
}
