"""
키움증권 수급(외인/기관) 관련 도구들
- 기관외국인연속매매현황요청
- 외국인기관매매상위요청
- 외인연속순매매상위요청
- 일별기관매매종목요청
- 장중투자자별매매상위요청
- 기타 수급 관련 API들
"""

from google.adk.tools import FunctionTool
from typing import Dict, Any, Optional
import requests
import os

# 모의투자 기본값
KIWOOM_IS_MOCK = os.getenv("KIWOOM_IS_MOCK", "true").lower() == "true"

# 도메인 설정
BASE_URL = "https://mockapi.kiwoom.com" if KIWOOM_IS_MOCK else "https://api.kiwoom.com"


def get_institution_foreign_continuous_trading_status(
    dt: str,
    mrkt_tp: str,
    netslmt_tp: str,
    stk_inds_tp: str,
    amt_qty_tp: str,
    stex_tp: str,
    strt_dt: Optional[str] = None,
    end_dt: Optional[str] = None,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 기관외국인연속매매현황요청 API (ka10131)

    Args:
        dt: 기간 (1:최근일, 3:3일, 5:5일, 10:10일, 20:20일, 120:120일, 0:시작일자/종료일자로 조회)
        mrkt_tp: 장구분 (001:코스피, 101:코스닥)
        netslmt_tp: 순매도수구분 (2:순매수(고정값))
        stk_inds_tp: 종목업종구분 (0:종목(주식), 1:업종)
        amt_qty_tp: 금액수량구분 (0:금액, 1:수량)
        stex_tp: 거래소구분 (1:KRX, 2:NXT, 3:통합)
        strt_dt: 시작일자 (YYYYMMDD 형식, 선택사항)
        end_dt: 종료일자 (YYYYMMDD 형식, 선택사항)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/frgnistt"

    headers = {"api-id": "ka10131", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "dt": dt,
        "mrkt_tp": mrkt_tp,
        "netslmt_tp": netslmt_tp,
        "stk_inds_tp": stk_inds_tp,
        "amt_qty_tp": amt_qty_tp,
        "stex_tp": stex_tp,
    }

    # 선택적 매개변수 추가
    if strt_dt:
        payload["strt_dt"] = strt_dt
    if end_dt:
        payload["end_dt"] = end_dt

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


def get_foreign_institution_trading_ranking(
    mrkt_tp: str,
    amt_qty_tp: str,
    qry_dt_tp: str,
    stex_tp: str,
    date: Optional[str] = None,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 외국인기관매매상위요청 API (ka90009)

    Args:
        mrkt_tp: 시장구분 (000:전체, 001:코스피, 101:코스닥)
        amt_qty_tp: 금액수량구분 (1:금액(천만), 2:수량(천))
        qry_dt_tp: 조회일자구분 (0:조회일자 미포함, 1:조회일자 포함)
        stex_tp: 거래소구분 (1:KRX, 2:NXT, 3:통합)
        date: 날짜 (YYYYMMDD 형식, 선택사항)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/rkinfo"

    headers = {"api-id": "ka90009", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "mrkt_tp": mrkt_tp,
        "amt_qty_tp": amt_qty_tp,
        "qry_dt_tp": qry_dt_tp,
        "stex_tp": stex_tp,
    }

    # 선택적 매개변수 추가
    if date:
        payload["date"] = date

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


def get_foreign_continuous_net_trading_ranking(
    mrkt_tp: str,
    trde_tp: str,
    base_dt_tp: str,
    stex_tp: str,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 외인연속순매매상위요청 API (ka10035)

    Args:
        mrkt_tp: 시장구분 (000:전체, 001:코스피, 101:코스닥)
        trde_tp: 매매구분 (1:연속순매도, 2:연속순매수)
        base_dt_tp: 기준일구분 (0:당일기준, 1:전일기준)
        stex_tp: 거래소구분 (1:KRX, 2:NXT, 3:통합)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/rkinfo"

    headers = {"api-id": "ka10035", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "mrkt_tp": mrkt_tp,
        "trde_tp": trde_tp,
        "base_dt_tp": base_dt_tp,
        "stex_tp": stex_tp,
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


def get_daily_institution_trading_stocks(
    strt_dt: str,
    end_dt: str,
    trde_tp: str,
    mrkt_tp: str,
    stex_tp: str,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 일별기관매매종목요청 API (ka10044)

    Args:
        strt_dt: 시작일자 (YYYYMMDD 형식)
        end_dt: 종료일자 (YYYYMMDD 형식)
        trde_tp: 매매구분 (1:순매도, 2:순매수)
        mrkt_tp: 시장구분 (001:코스피, 101:코스닥)
        stex_tp: 거래소구분 (1:KRX, 2:NXT, 3:통합)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/mrkcond"

    headers = {"api-id": "ka10044", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "strt_dt": strt_dt,
        "end_dt": end_dt,
        "trde_tp": trde_tp,
        "mrkt_tp": mrkt_tp,
        "stex_tp": stex_tp,
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


def get_intraday_investor_trading_ranking(
    trde_tp: str,
    mrkt_tp: str,
    orgn_tp: str,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 장중투자자별매매상위요청 API (ka10065)

    Args:
        trde_tp: 매매구분 (1:순매수, 2:순매도)
        mrkt_tp: 시장구분 (000:전체, 001:코스피, 101:코스닥)
        orgn_tp: 기관구분 (9000:외국인, 9100:외국계, 1000:금융투자, 3000:투신, 5000:기타금융, 4000:은행, 2000:보험, 6000:연기금, 7000:국가, 7100:기타법인, 9999:기관계)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/rkinfo"

    headers = {"api-id": "ka10065", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "trde_tp": trde_tp,
        "mrkt_tp": mrkt_tp,
        "orgn_tp": orgn_tp,
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


# 기관외국인연속매매현황요청 툴 정의
kiwoom_institution_foreign_continuous_trading_tool = FunctionTool(
    get_institution_foreign_continuous_trading_status
)

# 외국인기관매매상위요청 툴 정의
kiwoom_foreign_institution_trading_ranking_tool = FunctionTool(
    get_foreign_institution_trading_ranking
)

# 외인연속순매매상위요청 툴 정의
kiwoom_foreign_continuous_net_trading_ranking_tool = FunctionTool(
    get_foreign_continuous_net_trading_ranking
)

# 일별기관매매종목요청 툴 정의
kiwoom_daily_institution_trading_stocks_tool = FunctionTool(
    get_daily_institution_trading_stocks
)

# 장중투자자별매매상위요청 툴 정의
kiwoom_intraday_investor_trading_ranking_tool = FunctionTool(
    get_intraday_investor_trading_ranking
)

# 수급 관련 도구들
KIWOOM_SUPPLY_DEMAND_TOOLS = [
    kiwoom_institution_foreign_continuous_trading_tool,
    kiwoom_foreign_institution_trading_ranking_tool,
    kiwoom_foreign_continuous_net_trading_ranking_tool,
    kiwoom_daily_institution_trading_stocks_tool,
    kiwoom_intraday_investor_trading_ranking_tool,
]
