"""
키움증권 종목 정보 조회 관련 도구들
- 주식기본정보요청 (ka10001)
- 종목별프로그램매매현황요청 (ka90004)
"""

from google.adk.tools import FunctionTool
from typing import Dict, Any, Optional
import requests
import os

# 환경변수에서 키움증권 설정 가져오기
KIWOOM_IS_MOCK = os.getenv("KIWOOM_IS_MOCK", "true").lower() == "true"

# 도메인 설정
BASE_URL = "https://mockapi.kiwoom.com" if KIWOOM_IS_MOCK else "https://api.kiwoom.com"


def get_stock_basic_info(
    token: str,
    stk_cd: str,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
) -> Dict[str, Any]:
    """
    주식기본정보를 조회합니다.

    Args:
        token: 키움증권 접근토큰
        stk_cd: 종목코드 (예: "005930" for 삼성전자)
        cont_yn: 연속조회여부 (Y/N)
        next_key: 연속조회키

    Returns:
        주식기본정보 딕셔너리
    """
    try:
        if not token:
            return {"error": "키움증권 접근토큰이 필요합니다."}

        if not stk_cd:
            return {"error": "종목코드가 필요합니다."}

        url = f"{BASE_URL}/api/dostk/stkinfo"

        headers = {
            "api-id": "ka10001",
            "authorization": f"Bearer {token}",
            "Content-Type": "application/json;charset=UTF-8",
        }

        # 연속조회 헤더 추가
        if cont_yn:
            headers["cont-yn"] = cont_yn
        if next_key:
            headers["next-key"] = next_key

        data = {"stk_cd": stk_cd}

        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()

        result = response.json()

        # 응답 데이터 정리
        stock_info = {
            "success": True,
            "stock_code": result.get("stk_cd"),
            "stock_name": result.get("stk_nm"),
            "settlement_month": result.get("setl_mm"),
            "face_value": result.get("fav"),
            "capital": result.get("cap"),
            "listed_shares": result.get("flo_stk"),
            "credit_ratio": result.get("crd_rt"),
            "year_high": result.get("oyr_hgst"),
            "year_low": result.get("oyr_lwst"),
            "market_cap": result.get("mac"),
            "market_cap_weight": result.get("mac_wght"),
            "foreign_exhaustion_rate": result.get("for_exh_rt"),
            "replacement_price": result.get("repl_pric"),
            "per": result.get("per"),
            "eps": result.get("eps"),
            "roe": result.get("roe"),
            "pbr": result.get("pbr"),
            "ev": result.get("ev"),
            "bps": result.get("bps"),
            "sales_amount": result.get("sale_amt"),
            "business_profit": result.get("bus_pro"),
            "current_net_income": result.get("cup_nga"),
            "high_250": result.get("250hgst"),
            "low_250": result.get("250lwst"),
            "high_price": result.get("high_pric"),
            "open_price": result.get("open_pric"),
            "low_price": result.get("low_pric"),
            "upper_limit_price": result.get("upl_pric"),
            "lower_limit_price": result.get("lst_pric"),
            "base_price": result.get("base_pric"),
            "expected_contract_price": result.get("exp_cntr_pric"),
            "expected_contract_quantity": result.get("exp_cntr_qty"),
            "high_250_date": result.get("250hgst_pric_dt"),
            "high_250_ratio": result.get("250hgst_pric_pre_rt"),
            "low_250_date": result.get("250lwst_pric_dt"),
            "low_250_ratio": result.get("250lwst_pric_pre_rt"),
            "current_price": result.get("cur_prc"),
            "previous_signal": result.get("pre_sig"),
            "previous_contrast": result.get("pred_pre"),
            "fluctuation_rate": result.get("flu_rt"),
            "trading_quantity": result.get("trde_qty"),
            "trading_contrast": result.get("trde_pre"),
            "face_value_unit": result.get("fav_unit"),
            "distribution_stock": result.get("dstr_stk"),
            "distribution_ratio": result.get("dstr_rt"),
        }

        # 연속조회 정보 추가
        stock_info["cont_yn"] = response.headers.get("cont-yn")
        stock_info["next_key"] = response.headers.get("next-key")
        stock_info["return_code"] = result.get("return_code")
        stock_info["return_msg"] = result.get("return_msg")

        return stock_info

    except requests.exceptions.RequestException as e:
        return {"error": f"API 요청 실패: {str(e)}"}
    except Exception as e:
        return {"error": f"주식기본정보 조회 실패: {str(e)}"}


def get_stock_program_trading_status(
    token: str,
    dt: str,
    mrkt_tp: str,
    stex_tp: str,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
) -> Dict[str, Any]:
    """
    종목별프로그램매매현황을 조회합니다.

    Args:
        token: 키움증권 접근토큰
        dt: 일자 (YYYYMMDD 형식, 예: "20241125")
        mrkt_tp: 시장구분 (P00101:코스피, P10102:코스닥)
        stex_tp: 거래소구분 (1:KRX, 2:NXT, 3:통합)
        cont_yn: 연속조회여부 (Y/N)
        next_key: 연속조회키

    Returns:
        종목별프로그램매매현황 딕셔너리
    """
    try:
        if not token:
            return {"error": "키움증권 접근토큰이 필요합니다."}

        if not dt:
            return {"error": "일자가 필요합니다."}

        if not mrkt_tp:
            return {"error": "시장구분이 필요합니다."}

        if not stex_tp:
            return {"error": "거래소구분이 필요합니다."}

        url = f"{BASE_URL}/api/dostk/stkinfo"

        headers = {
            "api-id": "ka90004",
            "authorization": f"Bearer {token}",
            "Content-Type": "application/json;charset=UTF-8",
        }

        # 연속조회 헤더 추가
        if cont_yn:
            headers["cont-yn"] = cont_yn
        if next_key:
            headers["next-key"] = next_key

        data = {
            "dt": dt,
            "mrkt_tp": mrkt_tp,
            "stex_tp": stex_tp,
        }

        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()

        result = response.json()

        # 응답 데이터 정리
        program_trading_info = {
            "success": True,
            "date": dt,
            "market_type": mrkt_tp,
            "exchange_type": stex_tp,
            "total_buy_quantity": result.get("tot_1"),
            "total_buy_amount": result.get("tot_2"),
            "total_sell_quantity": result.get("tot_3"),
            "total_sell_amount": result.get("tot_4"),
            "total_net_buy_amount": result.get("tot_5"),
            "total_6": result.get("tot_6"),
            "stock_program_trading_list": [],
        }

        # 종목별프로그램매매현황 리스트 처리
        stock_list = result.get("stk_prm_trde_prst", [])
        for stock in stock_list:
            stock_info = {
                "stock_code": stock.get("stk_cd"),
                "stock_name": stock.get("stk_nm"),
                "current_price": stock.get("cur_prc"),
                "fluctuation_signal": stock.get("flu_sig"),
                "previous_contrast": stock.get("pred_pre"),
                "buy_contract_quantity": stock.get("buy_cntr_qty"),
                "buy_contract_amount": stock.get("buy_cntr_amt"),
                "sell_contract_quantity": stock.get("sel_cntr_qty"),
                "sell_contract_amount": stock.get("sel_cntr_amt"),
                "net_buy_amount": stock.get("netprps_prica"),
                "total_trading_ratio": stock.get("all_trde_rt"),
            }
            program_trading_info["stock_program_trading_list"].append(stock_info)

        # 연속조회 정보 추가
        program_trading_info["cont_yn"] = response.headers.get("cont-yn")
        program_trading_info["next_key"] = response.headers.get("next-key")
        program_trading_info["return_code"] = result.get("return_code")
        program_trading_info["return_msg"] = result.get("return_msg")

        return program_trading_info

    except requests.exceptions.RequestException as e:
        return {"error": f"API 요청 실패: {str(e)}"}
    except Exception as e:
        return {"error": f"종목별프로그램매매현황 조회 실패: {str(e)}"}


# 도구 생성
kiwoom_stock_basic_info_tool = FunctionTool(get_stock_basic_info)
kiwoom_stock_program_trading_tool = FunctionTool(get_stock_program_trading_status)

# 도구들
KIWOOM_STOCK_INFO_TOOLS = [
    kiwoom_stock_basic_info_tool,
    kiwoom_stock_program_trading_tool,
]
