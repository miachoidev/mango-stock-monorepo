"""
키움증권 차트 정보 관련  도구들 (14개)
- 일봉 차트
- 분봉 차트
- 주봉 차트
- 월봉 차트
- 등등...
"""

from google.adk.tools import FunctionTool
from typing import Dict, Any, Optional
import requests
import os

# 모의투자 기본값
KIWOOM_IS_MOCK = os.getenv("KIWOOM_IS_MOCK", "true").lower() == "true"

# 도메인 설정
BASE_URL = "https://mockapi.kiwoom.com" if KIWOOM_IS_MOCK else "https://api.kiwoom.com"


def get_stock_daily_chart(
    stk_cd: str,
    base_dt: str,
    upd_stkpc_tp: str = "1",
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 주식일봉차트조회요청 API (ka10081)

    Args:
        stk_cd: 종목코드 (예: "005930")
        base_dt: 기준일자 (YYYYMMDD 형식, 예: "20241108")
        upd_stkpc_tp: 수정주가구분 (0 or 1, 기본값: "1")
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/chart"

    headers = {"api-id": "ka10081", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {"stk_cd": stk_cd, "base_dt": base_dt, "upd_stkpc_tp": upd_stkpc_tp}

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


def get_stock_minute_chart(
    stk_cd: str,
    tic_scope: str,
    upd_stkpc_tp: str = "1",
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 주식분봉차트조회요청 API (ka10080)

    Args:
        stk_cd: 종목코드 (예: "005930")
        tic_scope: 틱범위 (1:1분, 3:3분, 5:5분, 10:10분, 15:15분, 30:30분, 45:45분, 60:60분)
        upd_stkpc_tp: 수정주가구분 (0 or 1, 기본값: "1")
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/chart"

    headers = {"api-id": "ka10080", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {"stk_cd": stk_cd, "tic_scope": tic_scope, "upd_stkpc_tp": upd_stkpc_tp}

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


# 주식일봉차트조회요청 툴 정의
kiwoom_stock_daily_chart_tool = FunctionTool(get_stock_daily_chart)

# 주식분봉차트조회요청 툴 정의
kiwoom_stock_minute_chart_tool = FunctionTool(get_stock_minute_chart)

#  도구들
KIWOOM_CHART_TOOLS = [
    kiwoom_stock_daily_chart_tool,
    kiwoom_stock_minute_chart_tool,
]
