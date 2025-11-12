"""
키움증권 순위정보 관련 도구들
- 거래량급증요청
- 당일거래량상위요청
- 거래대금상위요청
- 기타 순위정보 관련 API들
"""

from google.adk.tools import FunctionTool
from typing import Dict, Any, Optional
import requests
import os

# 모의투자 기본값
KIWOOM_IS_MOCK = os.getenv("KIWOOM_IS_MOCK", "true").lower() == "true"

# 도메인 설정
BASE_URL = "https://mockapi.kiwoom.com" if KIWOOM_IS_MOCK else "https://api.kiwoom.com"


def get_trading_volume_surge(
    mrkt_tp: str,
    sort_tp: str,
    tm_tp: str,
    trde_qty_tp: str,
    stk_cnd: str,
    pric_tp: str,
    stex_tp: str,
    tm: Optional[str] = None,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 거래량급증요청 API (ka10023)

    Args:
        mrkt_tp: 시장구분 (000:전체, 001:코스피, 101:코스닥)
        sort_tp: 정렬구분 (1:급증량, 2:급증률, 3:급감량, 4:급감률)
        tm_tp: 시간구분 (1:분, 2:전일)
        trde_qty_tp: 거래량구분 (5:5천주이상, 10:만주이상, 50:5만주이상, 100:10만주이상, 200:20만주이상, 300:30만주이상, 500:50만주이상, 1000:백만주이상)
        stk_cnd: 종목조건 (0:전체조회, 1:관리종목제외, 3:우선주제외, 11:정리매매종목제외, 4:관리종목,우선주제외, 5:증100제외, 6:증100만보기, 13:증60만보기, 12:증50만보기, 7:증40만보기, 8:증30만보기, 9:증20만보기, 17:ETN제외, 14:ETF제외, 18:ETF+ETN제외, 15:스팩제외, 20:ETF+ETN+스팩제외)
        pric_tp: 가격구분 (0:전체조회, 2:5만원이상, 5:1만원이상, 6:5천원이상, 8:1천원이상, 9:10만원이상)
        stex_tp: 거래소구분 (1:KRX, 2:NXT, 3:통합)
        tm: 시간 (분 입력, 선택사항)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/rkinfo"

    headers = {
        "api-id": "ka10023",
        "Content-Type": "application/json;charset=UTF-8",
    }

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "mrkt_tp": mrkt_tp,
        "sort_tp": sort_tp,
        "tm_tp": tm_tp,
        "trde_qty_tp": trde_qty_tp,
        "stk_cnd": stk_cnd,
        "pric_tp": pric_tp,
        "stex_tp": stex_tp,
    }

    # 선택적 매개변수 추가
    if tm:
        payload["tm"] = tm

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        # 상위 10개만 반환 (API는 limit을 지원하지 않으므로 클라이언트에서 제한)
        if "trde_qty_sdnin" in result and isinstance(result["trde_qty_sdnin"], list):
            result["trde_qty_sdnin"] = result["trde_qty_sdnin"][:10]
            result["limited_to"] = 10
            result["total_count"] = len(result["trde_qty_sdnin"])

        return result
    except requests.exceptions.RequestException as e:
        return {
            "error": f"API 요청 실패: {str(e)}",
            "return_code": -1,
            "return_msg": "API 요청 중 오류가 발생했습니다.",
        }


def get_daily_trading_volume_ranking(
    mrkt_tp: str,
    sort_tp: str,
    mang_stk_incls: str,
    crd_tp: str,
    trde_qty_tp: str,
    pric_tp: str,
    trde_prica_tp: str,
    mrkt_open_tp: str,
    stex_tp: str,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 당일거래량상위요청 API (ka10030)

    Args:
        mrkt_tp: 시장구분 (000:전체, 001:코스피, 101:코스닥)
        sort_tp: 정렬구분 (1:거래량, 2:거래회전율, 3:거래대금)
        mang_stk_incls: 관리종목포함 (0:관리종목 포함, 1:관리종목 미포함, 3:우선주제외, 11:정리매매종목제외, 4:관리종목, 우선주제외, 5:증100제외, 6:증100마나보기, 13:증60만보기, 12:증50만보기, 7:증40만보기, 8:증30만보기, 9:증20만보기, 14:ETF제외, 15:스팩제외, 16:ETF+ETN제외)
        crd_tp: 신용구분 (0:전체조회, 9:신용융자전체, 1:신용융자A군, 2:신용융자B군, 3:신용융자C군, 4:신용융자D군, 8:신용대주)
        trde_qty_tp: 거래량구분 (0:전체조회, 5:5천주이상, 10:1만주이상, 50:5만주이상, 100:10만주이상, 200:20만주이상, 300:30만주이상, 500:500만주이상, 1000:백만주이상)
        pric_tp: 가격구분 (0:전체조회, 1:1천원미만, 2:1천원이상, 3:1천원~2천원, 4:2천원~5천원, 5:5천원이상, 6:5천원~1만원, 10:1만원미만, 7:1만원이상, 8:5만원이상, 9:10만원이상)
        trde_prica_tp: 거래대금구분 (0:전체조회, 1:1천만원이상, 3:3천만원이상, 4:5천만원이상, 10:1억원이상, 30:3억원이상, 50:5억원이상, 100:10억원이상, 300:30억원이상, 500:50억원이상, 1000:100억원이상, 3000:300억원이상, 5000:500억원이상)
        mrkt_open_tp: 장운영구분 (0:전체조회, 1:장중, 2:장전시간외, 3:장후시간외)
        stex_tp: 거래소구분 (1:KRX, 2:NXT, 3:통합)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/rkinfo"

    headers = {"api-id": "ka10030", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "mrkt_tp": mrkt_tp,
        "sort_tp": sort_tp,
        "mang_stk_incls": mang_stk_incls,
        "crd_tp": crd_tp,
        "trde_qty_tp": trde_qty_tp,
        "pric_tp": pric_tp,
        "trde_prica_tp": trde_prica_tp,
        "mrkt_open_tp": mrkt_open_tp,
        "stex_tp": stex_tp,
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        # 상위 10개만 반환 (API는 limit을 지원하지 않으므로 클라이언트에서 제한)
        if "trde_qty_upper" in result and isinstance(result["trde_qty_upper"], list):
            result["trde_qty_upper"] = result["trde_qty_upper"][:10]
            result["limited_to"] = 10
            result["total_count"] = len(result["trde_qty_upper"])

        return result
    except requests.exceptions.RequestException as e:
        return {
            "error": f"API 요청 실패: {str(e)}",
            "return_code": -1,
            "return_msg": "API 요청 중 오류가 발생했습니다.",
        }


def get_trading_amount_ranking(
    mrkt_tp: str,
    mang_stk_incls: str,
    stex_tp: str,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 거래대금상위요청 API (ka10032)

    Args:
        mrkt_tp: 시장구분 (000:전체, 001:코스피, 101:코스닥)
        mang_stk_incls: 관리종목포함 (0:관리종목 미포함, 1:관리종목 포함)
        stex_tp: 거래소구분 (1:KRX, 2:NXT, 3:통합)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/rkinfo"

    headers = {"api-id": "ka10032", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "mrkt_tp": mrkt_tp,
        "mang_stk_incls": mang_stk_incls,
        "stex_tp": stex_tp,
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        # 상위 10개만 반환 (API는 limit을 지원하지 않으므로 클라이언트에서 제한)
        if "trde_prica_upper" in result and isinstance(
            result["trde_prica_upper"], list
        ):
            result["trde_prica_upper"] = result["trde_prica_upper"][:10]
            result["limited_to"] = 10
            result["total_count"] = len(result["trde_prica_upper"])

        return result
    except requests.exceptions.RequestException as e:
        return {
            "error": f"API 요청 실패: {str(e)}",
            "return_code": -1,
            "return_msg": "API 요청 중 오류가 발생했습니다.",
        }


def get_daily_price_change_ranking(
    mrkt_tp: str,
    sort_tp: str,
    trde_qty_cnd: str,
    stk_cnd: str,
    crd_cnd: str,
    updown_incls: str,
    pric_cnd: str,
    trde_prica_cnd: str,
    stex_tp: str,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 전일대비등락률상위요청 API (ka10027)

    Args:
        mrkt_tp: 시장구분 (000:전체, 001:코스피, 101:코스닥)
        sort_tp: 정렬구분 (1:상승률, 2:상승폭, 3:하락률, 4:하락폭, 5:보합)
        trde_qty_cnd: 거래량조건 (0000:전체조회, 0010:만주이상, 0050:5만주이상, 0100:10만주이상, 0150:15만주이상, 0200:20만주이상, 0300:30만주이상, 0500:50만주이상, 1000:백만주이상)
        stk_cnd: 종목조건 (0:전체조회, 1:관리종목제외, 4:우선주+관리주제외, 3:우선주제외, 5:증100제외, 6:증100만보기, 7:증40만보기, 8:증30만보기, 9:증20만보기, 11:정리매매종목제외, 12:증50만보기, 13:증60만보기, 14:ETF제외, 15:스펙제외, 16:ETF+ETN제외)
        crd_cnd: 신용조건 (0:전체조회, 1:신용융자A군, 2:신용융자B군, 3:신용융자C군, 4:신용융자D군, 7:신용융자E군, 9:신용융자전체)
        updown_incls: 상하한포함 (0:불 포함, 1:포함)
        pric_cnd: 가격조건 (0:전체조회, 1:1천원미만, 2:1천원~2천원, 3:2천원~5천원, 4:5천원~1만원, 5:1만원이상, 8:1천원이상, 10:1만원미만)
        trde_prica_cnd: 거래대금조건 (0:전체조회, 3:3천만원이상, 5:5천만원이상, 10:1억원이상, 30:3억원이상, 50:5억원이상, 100:10억원이상, 300:30억원이상, 500:50억원이상, 1000:100억원이상, 3000:300억원이상, 5000:500억원이상)
        stex_tp: 거래소구분 (1:KRX, 2:NXT, 3:통합)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰
    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/rkinfo"

    headers = {"api-id": "ka10027", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "mrkt_tp": mrkt_tp,
        "sort_tp": sort_tp,
        "trde_qty_cnd": trde_qty_cnd,
        "stk_cnd": stk_cnd,
        "crd_cnd": crd_cnd,
        "updown_incls": updown_incls,
        "pric_cnd": pric_cnd,
        "trde_prica_cnd": trde_prica_cnd,
        "stex_tp": stex_tp,
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        # 상위 10개만 반환 (API는 limit을 지원하지 않으므로 클라이언트에서 제한)
        if "pred_pre_flu_rt_upper" in result and isinstance(
            result["pred_pre_flu_rt_upper"], list
        ):
            result["pred_pre_flu_rt_upper"] = result["pred_pre_flu_rt_upper"][:10]
            result["limited_to"] = 10
            result["total_count"] = len(result["pred_pre_flu_rt_upper"])

        return result
    except requests.exceptions.RequestException as e:
        return {
            "error": f"API 요청 실패: {str(e)}",
            "return_code": -1,
            "return_msg": "API 요청 중 오류가 발생했습니다.",
        }


def get_expected_price_change_ranking(
    mrkt_tp: str,
    sort_tp: str,
    trde_qty_cnd: str,
    stk_cnd: str,
    crd_cnd: str,
    pric_cnd: str,
    stex_tp: str,
    cont_yn: Optional[str] = None,
    next_key: Optional[str] = None,
    authorization: Optional[str] = None,
) -> Dict[str, Any]:
    """
    키움증권 예상체결등락률상위요청 API (ka10029)

    Args:
        mrkt_tp: 시장구분 (000:전체, 001:코스피, 101:코스닥)
        sort_tp: 정렬구분 (1:상승률, 2:상승폭, 3:보합, 4:하락률, 5:하락폭, 6:체결량, 7:상한, 8:하한)
        trde_qty_cnd: 거래량조건 (0:전체조회, 1:천주이상, 3:3천주, 5:5천주, 10:만주이상, 50:5만주이상, 100:10만주이상)
        stk_cnd: 종목조건 (0:전체조회, 1:관리종목제외, 3:우선주제외, 4:관리종목,우선주제외, 5:증100제외, 6:증100만보기, 7:증40만보기, 8:증30만보기, 9:증20만보기, 11:정리매매종목제외, 12:증50만보기, 13:증60만보기, 14:ETF제외, 15:스팩제외, 16:ETF+ETN제외)
        crd_cnd: 신용조건 (0:전체조회, 1:신용융자A군, 2:신용융자B군, 3:신용융자C군, 4:신용융자D군, 5:신용한도초과제외, 7:신용융자E군, 8:신용대주, 9:신용융자전체)
        pric_cnd: 가격조건 (0:전체조회, 1:1천원미만, 2:1천원~2천원, 3:2천원~5천원, 4:5천원~1만원, 5:1만원이상, 8:1천원이상, 10:1만원미만)
        stex_tp: 거래소구분 (1:KRX, 2:NXT, 3:통합)
        cont_yn: 연속조회여부 (선택사항)
        next_key: 연속조회키 (선택사항)
        authorization: 접근토큰 (선택사항)

    Returns:
        Dict: API 응답 데이터
    """
    url = f"{BASE_URL}/api/dostk/rkinfo"

    headers = {"api-id": "ka10029", "Content-Type": "application/json;charset=UTF-8"}

    if authorization:
        headers["authorization"] = f"Bearer {authorization}"

    if cont_yn:
        headers["cont-yn"] = cont_yn

    if next_key:
        headers["next-key"] = next_key

    payload = {
        "mrkt_tp": mrkt_tp,
        "sort_tp": sort_tp,
        "trde_qty_cnd": trde_qty_cnd,
        "stk_cnd": stk_cnd,
        "crd_cnd": crd_cnd,
        "pric_cnd": pric_cnd,
        "stex_tp": stex_tp,
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        # 상위 10개만 반환 (API는 limit을 지원하지 않으므로 클라이언트에서 제한)
        if "exp_cntr_flu_rt_upper" in result and isinstance(
            result["exp_cntr_flu_rt_upper"], list
        ):
            result["exp_cntr_flu_rt_upper"] = result["exp_cntr_flu_rt_upper"][:10]
            result["limited_to"] = 10
            result["total_count"] = len(result["exp_cntr_flu_rt_upper"])

        return result
    except requests.exceptions.RequestException as e:
        return {
            "error": f"API 요청 실패: {str(e)}",
            "return_code": -1,
            "return_msg": "API 요청 중 오류가 발생했습니다.",
        }


# 거래량급증요청 툴 정의
kiwoom_trading_volume_surge_tool = FunctionTool(get_trading_volume_surge)

# 당일거래량상위요청 툴 정의
kiwoom_daily_trading_volume_ranking_tool = FunctionTool(
    get_daily_trading_volume_ranking
)

# 거래대금상위요청 툴 정의
kiwoom_trading_amount_ranking_tool = FunctionTool(get_trading_amount_ranking)

# 전일대비등락률상위요청 툴 정의
kiwoom_daily_price_change_ranking_tool = FunctionTool(get_daily_price_change_ranking)

# 예상체결등락률상위요청 툴 정의
kiwoom_expected_price_change_ranking_tool = FunctionTool(
    get_expected_price_change_ranking
)

# 순위정보 관련 도구들
KIWOOM_RANKING_TOOLS = [
    kiwoom_trading_volume_surge_tool,
    kiwoom_daily_trading_volume_ranking_tool,
    kiwoom_trading_amount_ranking_tool,
    kiwoom_daily_price_change_ranking_tool,
    kiwoom_expected_price_change_ranking_tool,
]
