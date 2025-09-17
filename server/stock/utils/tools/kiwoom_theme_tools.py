"""
키움증권 테마 정보 관련 도구들
- 테마구성종목요청: 특정 테마에 속한 종목들의 상세 정보 조회
- 테마그룹별요청: 테마 그룹별 정보 조회
- 기타 테마 관련 API들
"""

from google.adk.tools import FunctionTool
from typing import Dict, Any, Optional
import requests
import os

# 모의투자 기본값
KIWOOM_IS_MOCK = os.getenv("KIWOOM_IS_MOCK", "true").lower() == "true"

# 도메인 설정
BASE_URL = "https://mockapi.kiwoom.com" if KIWOOM_IS_MOCK else "https://api.kiwoom.com"


def get_theme_component_stocks(
    thema_grp_cd: str,
    stex_tp: str,
    date_tp: Optional[str] = None,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 테마구성종목요청 API (ka90002)

    Args:
        thema_grp_cd: 테마그룹코드 (6자리 테마그룹코드 번호)
        stex_tp: 거래소구분 (1:KRX, 2:NXT, 3:통합)
        date_tp: 날짜구분 (1일 ~ 99일, 선택사항)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/thme"

    headers = {"api-id": "ka90002", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "thema_grp_cd": thema_grp_cd,
        "stex_tp": stex_tp,
    }

    # 선택적 매개변수 추가
    if date_tp:
        payload["date_tp"] = date_tp

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


def get_theme_group_info(
    qry_tp: str,
    date_tp: str,
    flu_pl_amt_tp: str,
    stex_tp: str,
    stk_cd: Optional[str] = None,
    thema_nm: Optional[str] = None,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 테마그룹별요청 API (ka90001)

    Args:
        qry_tp: 검색구분 (0:전체검색, 1:테마검색, 2:종목검색)
        date_tp: 날짜구분 (n일전, 1일 ~ 99일)
        flu_pl_amt_tp: 등락수익구분 (1:상위기간수익률, 2:하위기간수익률, 3:상위등락률, 4:하위등락률)
        stex_tp: 거래소구분 (1:KRX, 2:NXT, 3:통합)
        stk_cd: 종목코드 (선택사항)
        thema_nm: 테마명 (선택사항)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/thme"

    headers = {"api-id": "ka90001", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "qry_tp": qry_tp,
        "date_tp": date_tp,
        "flu_pl_amt_tp": flu_pl_amt_tp,
        "stex_tp": stex_tp,
    }

    # 선택적 매개변수 추가
    if stk_cd:
        payload["stk_cd"] = stk_cd
    if thema_nm:
        payload["thema_nm"] = thema_nm

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


# 테마구성종목요청 툴 정의
kiwoom_theme_component_stocks_tool = FunctionTool(get_theme_component_stocks)

# 테마그룹별요청 툴 정의
kiwoom_theme_group_info_tool = FunctionTool(get_theme_group_info)

# 테마 관련 도구들
KIWOOM_THEME_TOOLS = [
    kiwoom_theme_component_stocks_tool,
    kiwoom_theme_group_info_tool,
]
