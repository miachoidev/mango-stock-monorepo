"""
키움증권 계좌 정보 관련 도구들
- 계좌평가현황요청 (kt00004)
"""

from google.adk.tools import FunctionTool
from typing import Dict, Any, Optional
import requests
import os

# 환경변수에서 키움증권 설정 가져오기
KIWOOM_IS_MOCK = os.getenv("KIWOOM_IS_MOCK", "true").lower() == "true"

# 도메인 설정
BASE_URL = "https://mockapi.kiwoom.com" if KIWOOM_IS_MOCK else "https://api.kiwoom.com"


def get_account_evaluation(
    token: str,
    qry_tp: str = "0",
    dmst_stex_tp: str = "KRX",
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
) -> Dict[str, Any]:
    """
    계좌평가현황을 조회합니다.

    Args:
        token: 키움증권 접근토큰
        qry_tp: 상장폐지조회구분 (0:전체, 1:상장폐지종목제외)
        dmst_stex_tp: 국내거래소구분 (KRX:한국거래소, NXT:넥스트트레이드)
        cont_yn: 연속조회여부 (Y/N)
        next_key: 연속조회키

    Returns:
        계좌평가현황 정보 딕셔너리
    """
    try:
        if not token:
            return {"error": "키움증권 접근토큰이 필요합니다."}

        url = f"{BASE_URL}/api/dostk/acnt"

        headers = {
            "api-id": "kt00004",
            "authorization": f"Bearer {token}",
            "Content-Type": "application/json;charset=UTF-8",
        }

        # 연속조회 헤더 추가
        if cont_yn:
            headers["cont-yn"] = cont_yn
        if next_key:
            headers["next-key"] = next_key

        data = {"qry_tp": qry_tp, "dmst_stex_tp": dmst_stex_tp}

        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()

        result = response.json()

        # 응답 데이터 정리
        account_info = {
            "success": True,
            "account_name": result.get("acnt_nm"),
            "branch_name": result.get("brch_nm"),
            "deposit": result.get("entr"),
            "d2_estimated_deposit": result.get("d2_entra"),
            "total_estimated_amount": result.get("tot_est_amt"),
            "asset_evaluation_amount": result.get("aset_evlt_amt"),
            "total_purchase_amount": result.get("tot_pur_amt"),
            "estimated_deposit_asset": result.get("prsm_dpst_aset_amt"),
            "total_guarantee_sell_amount": result.get("tot_grnt_sella"),
            "today_investment_principal": result.get("tdy_lspft_amt"),
            "monthly_investment_principal": result.get("invt_bsamt"),
            "cumulative_investment_principal": result.get("lspft_amt"),
            "today_profit_loss": result.get("tdy_lspft"),
            "monthly_profit_loss": result.get("lspft2"),
            "cumulative_profit_loss": result.get("lspft"),
            "today_profit_loss_rate": result.get("tdy_lspft_rt"),
            "monthly_profit_loss_rate": result.get("lspft_ratio"),
            "cumulative_profit_loss_rate": result.get("lspft_rt"),
            "stocks": [],
        }

        # 종목별 계좌평가현황 처리
        stocks_data = result.get("stk_acnt_evlt_prst", [])
        for stock in stocks_data:
            stock_info = {
                "stock_code": stock.get("stk_cd"),
                "stock_name": stock.get("stk_nm"),
                "remaining_quantity": stock.get("rmnd_qty"),
                "average_price": stock.get("avg_prc"),
                "current_price": stock.get("cur_prc"),
                "evaluation_amount": stock.get("evlt_amt"),
                "profit_loss_amount": stock.get("pl_amt"),
                "profit_loss_rate": stock.get("pl_rt"),
                "loan_date": stock.get("loan_dt"),
                "purchase_amount": stock.get("pur_amt"),
                "settlement_balance": stock.get("setl_remn"),
                "previous_buy_quantity": stock.get("pred_buyq"),
                "previous_sell_quantity": stock.get("pred_sellq"),
                "today_buy_quantity": stock.get("tdy_buyq"),
                "today_sell_quantity": stock.get("tdy_sellq"),
            }
            account_info["stocks"].append(stock_info)

        # 연속조회 정보 추가
        account_info["cont_yn"] = response.headers.get("cont-yn")
        account_info["next_key"] = response.headers.get("next-key")
        account_info["return_code"] = result.get("return_code")
        account_info["return_msg"] = result.get("return_msg")

        return account_info

    except requests.exceptions.RequestException as e:
        return {"error": f"API 요청 실패: {str(e)}"}
    except Exception as e:
        return {"error": f"계좌평가현황 조회 실패: {str(e)}"}


# 도구 생성
kiwoom_account_evaluation_tool = FunctionTool(get_account_evaluation)

# 도구들
KIWOOM_ACCOUNT_TOOLS = [kiwoom_account_evaluation_tool]
