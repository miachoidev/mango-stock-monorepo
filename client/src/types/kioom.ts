export interface StockInfo {
  stk_cd: string; // 종목코드
  stk_nm: string; // 종목명
  cur_prc: string; // 현재가
  prdy_vrss: string; // 전일대비
  prdy_vrss_sign: string; // 전일대비부호
  prdy_ctrt: string; // 전일대비율
  acml_vol: string; // 누적거래량
  acml_tr_pbmn: string; // 누적거래대금
  hts_kor_isnm: string; // HTS한글종목명
  mksc_shrn_iscd: string; // 시장구분코드
  return_code: number;
  return_msg: string;
}

export interface BalanceDetail {
  dt: string;
  tot_buy_amt: string;
  tot_evlt_amt: string;
  tot_evltv_prft: string;
  tot_prft_rt: string;
  dbst_bal: string;
  day_stk_asst: string;
  buy_wght: string;
  day_bal_rt: string[];
  return_code: number;
  return_msg: string;
}
