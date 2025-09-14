import { BalanceDetail } from "@/types/kioom";
import { KIOOM_API } from "@/utils/api/kiwoom.api";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const DailyBalance = () => {
  const { data } = useQuery<BalanceDetail>({
    queryKey: ["balanceDetail"],
    queryFn: () => KIOOM_API.getBalanceDetail(),
  });

  if (!data) {
    return (
      <div className="h-fullflex flex-col justify-center items-center">
        <div className="text-gray-500">데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="text-lg font-bold mb-4 text-center">일별 잔고 현황</div>
      <div className="flex flex-col space-y-2">
        <BalanceItem label="일자" value={data.dt} />
        <BalanceItem label="총 매입가" value={data.tot_buy_amt} />
        <BalanceItem label="총 평가금액" value={data.tot_evlt_amt} />
        <BalanceItem label="총 평가손익" value={data.tot_evltv_prft} />
        <BalanceItem label="수익률" value={data.tot_prft_rt} />
        <BalanceItem label="예수금" value={data.dbst_bal} />
        <BalanceItem label="추정자산" value={data.day_stk_asst} />
        <BalanceItem label="현금비중" value={data.buy_wght} />
      </div>

      <div className="flex flex-col space-y-2 mt-10 text-center">
        {data.return_msg}
      </div>
    </div>
  );
};

export default DailyBalance;

const BalanceItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="text-sm font-semibold text-gray-900">
        {value ? `${value}원` : "-"}
      </div>
    </div>
  );
};
