"""
키움증권 업종(섹터) 정보 관련 도구들
- 업종코드 리스트요청: 사용 가능한 업종 코드 목록 조회
- 업종(섹터)현재가요청: 업종 전체의 지수 정보 조회 (업종 지수, 전일대비, 등락률 등)
- 업종별주가요청: 업종 내 개별 종목들의 주가 정보 조회 (종목별 현재가, 등락률, 거래량 등)
- 전업종지수요청: 전체 업종의 지수 정보를 한 번에 조회
- 어떤 섹터(반도체, 화장품, 전기 등)가 주도하고 있는지, 각 섹터별 주가, 전체 지수 분석용

📊 API 구분 가이드:
- ka20001 (업종현재가): 업종 전체의 "지수 흐름" - 업종 지수 현재가, 전일대비, 등락률
- ka20002 (업종별주가): 업종 내 "개별 종목들의 주가 리스트" - 종목별 현재가, 등락률, 거래량
- ka20003 (전업종지수): "전체 업종의 지수 정보" - 모든 업종의 지수를 한 번에 조회
"""

from google.adk.tools import FunctionTool
from typing import Dict, Any, Optional
import requests
import os

# 모의투자 기본값
KIWOOM_IS_MOCK = os.getenv("KIWOOM_IS_MOCK", "true").lower() == "true"

# 도메인 설정
BASE_URL = "https://mockapi.kiwoom.com" if KIWOOM_IS_MOCK else "https://api.kiwoom.com"


def get_sector_code_list(
    mrkt_tp: str,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 업종코드 리스트 API (ka10101)

    Args:
        mrkt_tp: 시장구분 (0:코스피, 1:코스닥, 2:KOSPI200, 4:KOSPI100, 7:KRX100)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/stkinfo"

    headers = {"api-id": "ka10101", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "mrkt_tp": mrkt_tp,
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


def get_sector_current_price(
    mrkt_tp: str,
    inds_cd: str,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 업종(섹터)현재가요청 API (ka20001)

    Args:
        mrkt_tp: 시장구분 (0:코스피, 1:코스닥, 2:코스피200)
        inds_cd: ※ 업종코드 참고
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/sect"

    headers = {"api-id": "ka20001", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "mrkt_tp": mrkt_tp,
        "inds_cd": inds_cd,
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


def get_sector_stock_prices(
    mrkt_tp: str,
    inds_cd: str,
    stex_tp: str,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 업종별주가요청 API (ka20002)

    Args:
        mrkt_tp: 시장구분 (0:코스피, 1:코스닥, 2:코스피200)
        inds_cd: 업종코드 (001:종합(KOSPI), 002:대형주, 003:중형주, 004:소형주, 101:종합(KOSDAQ), 201:KOSPI200, 302:KOSTAR, 701:KRX100)
        stex_tp: 거래소구분 (1:KRX, 2:NXT, 3:통합)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/sect"

    headers = {"api-id": "ka20002", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "mrkt_tp": mrkt_tp,
        "inds_cd": inds_cd,
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


def get_all_sector_index(
    inds_cd: str,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 전업종지수요청 API (ka20003)

    Args:
        inds_cd: 업종코드 (001:종합(KOSPI), 101:종합(KOSDAQ))
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/sect"

    headers = {"api-id": "ka20003", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "inds_cd": inds_cd,
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


# 업종코드 리스트 툴 정의
kiwoom_sector_code_list_tool = FunctionTool(get_sector_code_list)

# 업종(섹터)현재가요청 툴 정의 - 업종 전체의 지수 정보 조회
kiwoom_sector_current_price_tool = FunctionTool(get_sector_current_price)

# 업종별주가요청 툴 정의 - 업종 내 개별 종목들의 주가 정보 조회
kiwoom_sector_stock_prices_tool = FunctionTool(get_sector_stock_prices)

# 전업종지수요청 툴 정의 - 전체 업종의 지수 정보 조회
kiwoom_all_sector_index_tool = FunctionTool(get_all_sector_index)


# 업종(섹터) 관련 도구들
KIWOOM_SECTOR_TOOLS = [
    kiwoom_sector_code_list_tool,
    kiwoom_sector_current_price_tool,
    kiwoom_sector_stock_prices_tool,
    kiwoom_all_sector_index_tool,
]
