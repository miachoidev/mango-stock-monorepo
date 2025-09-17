"""
키움증권 시세 정보 관련 도구들
- 종목별기관매매추이요청
- 공매도추이요청
- 기타 시세 관련 API들
"""

from google.adk.tools import FunctionTool
from typing import Dict, Any, Optional
import requests
import os

# 모의투자 기본값
KIWOOM_IS_MOCK = os.getenv("KIWOOM_IS_MOCK", "true").lower() == "true"

# 도메인 설정
BASE_URL = "https://mockapi.kiwoom.com" if KIWOOM_IS_MOCK else "https://api.kiwoom.com"


def get_stock_institution_trading_trend(
    stk_cd: str,
    strt_dt: str,
    end_dt: str,
    orgn_prsm_unp_tp: str,
    for_prsm_unp_tp: str,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 종목별기관매매추이요청 API (ka10045)

    Args:
        stk_cd: 종목코드 (예: "005930")
        strt_dt: 시작일자 (YYYYMMDD 형식, 예: "20241007")
        end_dt: 종료일자 (YYYYMMDD 형식, 예: "20241107")
        orgn_prsm_unp_tp: 기관추정단가구분 (1:매수단가, 2:매도단가)
        for_prsm_unp_tp: 외인추정단가구분 (1:매수단가, 2:매도단가)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/mrkcond"

    headers = {"api-id": "ka10045", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "stk_cd": stk_cd,
        "strt_dt": strt_dt,
        "end_dt": end_dt,
        "orgn_prsm_unp_tp": orgn_prsm_unp_tp,
        "for_prsm_unp_tp": for_prsm_unp_tp,
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {
            "error": f"API 요청 실패: {str(e)}",
            "return_code": -1,
            "return_msg": "API 요청 중 오류가 발생했습니다.",
        }


def get_short_selling_trend(
    stk_cd: str,
    strt_dt: str,
    end_dt: str,
    tm_tp: str = "1",
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 공매도추이요청 API (ka10014)

    Args:
        stk_cd: 종목코드 (예: "005930")
        strt_dt: 시작일자 (YYYYMMDD 형식, 예: "20250501")
        end_dt: 종료일자 (YYYYMMDD 형식, 예: "20250519")
        tm_tp: 시간구분 (0:시작일, 1:기간, 기본값: "1")
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/shsa"

    headers = {"api-id": "ka10014", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "stk_cd": stk_cd,
        "tm_tp": tm_tp,
        "strt_dt": strt_dt,
        "end_dt": end_dt,
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {
            "error": f"API 요청 실패: {str(e)}",
            "return_code": -1,
            "return_msg": "API 요청 중 오류가 발생했습니다.",
        }


# 종목별기관매매추이요청 툴 정의
kiwoom_stock_institution_trading_trend_tool = FunctionTool(
    get_stock_institution_trading_trend
)

# 공매도추이요청 툴 정의
kiwoom_short_selling_trend_tool = FunctionTool(get_short_selling_trend)

# 시세 관련 도구들
KIWOOM_MARKET_TOOLS = [
    kiwoom_stock_institution_trading_trend_tool,
    kiwoom_short_selling_trend_tool,
]
