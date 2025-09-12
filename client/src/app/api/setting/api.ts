import axios from "axios";
import Cookies from "js-cookie";

// export const KIOOM_API_BASE_URL = "https://api.kiwoom.com";
export const KIOOM_API_BASE_URL = "https://mockapi.kiwoom.com/api";

export const axiosInstance = axios.create({
  baseURL: KIOOM_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.authorization = `Bearer ${Cookies.get("token")}`;
  config.headers["Content-Type"] = "application/json";
  return config;
});

export const KIOOM_API_HEADER_KEY = {
  일별잔고수익률: "ka01690",
  계좌수익률: "ka10085",
};
