import axios from "axios";

// 접근토큰 발급 (클라이언트에서 API 라우트 호출)
export const kiwoomLogin = async () => {
  try {
    const response = await axios.post("/api/kiwoom/login", {
      method: "POST",
    });

    console.log(response);

    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } else {
      console.error("로그인 실패:", response.data);
      return null;
    }
  } catch (error) {
    console.error("요청 실패:", error);
    return null;
  }
};
