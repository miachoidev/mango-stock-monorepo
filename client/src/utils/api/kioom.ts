import { axiosInstance, KIOOM_API_HEADER_KEY } from "@/app/api/setting/api";

const getBalanceDetail = async () => {
  const today = new Date().toISOString().split("T")[0];
  const response = await axiosInstance.post(
    `/dostk/acnt`,
    { qry_dt: today },
    {
      headers: {
        "api-id": KIOOM_API_HEADER_KEY["일별잔고수익률"],
        cont_yn: "Y",
        next_key: "0",
      },
    }
  );
  const data = await response.data;
  return data;
};

export const KIOOM_API = {
  getBalanceDetail,
};
