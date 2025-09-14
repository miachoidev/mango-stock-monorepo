import axios from "axios";

// export const KIOOM_API_BASE_URL = "https://api.kiwoom.com";
export const KIOOM_API_BASE_URL = "https://mockapi.kiwoom.com/api";

export const axiosInstance = axios.create({
  baseURL: KIOOM_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/json";
  config.headers["authorization"] = `Bearer ${localStorage.getItem("token")}`;
  config.headers["cont-yn"] = "Y";
  config.headers["next-key"] = "0";
  return config;
});
