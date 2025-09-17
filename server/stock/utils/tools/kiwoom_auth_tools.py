"""
키움증권 API 인증 관련 도구들
- 접근토큰 발급 (au10001)
- 토큰 갱신
"""

from google.adk.tools import FunctionTool
from typing import Dict, Any
import requests
import os

# 환경변수에서 키움증권 API 키 가져오기
KIWOOM_APPKEY = os.getenv("KIWOOM_APPKEY")
KIWOOM_SECRETKEY = os.getenv("KIWOOM_SECRETKEY")
# 모의투자 기본값
KIWOOM_IS_MOCK = os.getenv("KIWOOM_IS_MOCK", "true").lower() == "true"

# 도메인 설정
BASE_URL = "https://mockapi.kiwoom.com" if KIWOOM_IS_MOCK else "https://api.kiwoom.com"


def get_access_token() -> Dict[str, Any]:
    """
    키움증권 OAuth 접근토큰을 발급받습니다.
    이 도구는 키움증권 API를 사용하기 전에 반드시 먼저 실행해야 합니다.
    환경변수 KIWOOM_APPKEY, KIWOOM_SECRETKEY가 설정되어 있어야 합니다.

    Returns:
        토큰 정보 딕셔너리 (token, token_type, expires_dt 포함)
    """
    try:
        if not KIWOOM_APPKEY or not KIWOOM_SECRETKEY:
            return {
                "error": "키움증권 API 키가 설정되지 않았습니다. KIWOOM_APPKEY, KIWOOM_SECRETKEY 환경변수를 설정해주세요."
            }

        url = f"{BASE_URL}/oauth2/token"

        headers = {
            "api-id": "au10001",
            "Content-Type": "application/json;charset=UTF-8",
        }

        data = {
            "grant_type": "client_credentials",
            "appkey": KIWOOM_APPKEY,
            "secretkey": KIWOOM_SECRETKEY,
        }

        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()

        result = response.json()

        # 토큰 정보 반환
        return {
            "success": True,
            "token": result.get("token"),
            "token_type": result.get("token_type"),
            "expires_dt": result.get("expires_dt"),
            "return_code": result.get("return_code"),
            "return_msg": result.get("return_msg"),
        }

    except requests.exceptions.RequestException as e:
        return {"error": f"API 요청 실패: {str(e)}"}
    except Exception as e:
        return {"error": f"토큰 발급 실패: {str(e)}"}


def refresh_access_token(current_token: str) -> Dict[str, Any]:
    """
    기존 토큰을 사용하여 새로운 접근토큰을 발급받습니다.

    Args:
        current_token: 현재 사용 중인 토큰

    Returns:
        새로운 토큰 정보 딕셔너리
    """
    try:
        if not current_token:
            return {"error": "현재 토큰이 제공되지 않았습니다."}

        url = f"{BASE_URL}/oauth2/token"

        headers = {
            "api-id": "au10001",
            "authorization": f"Bearer {current_token}",
            "Content-Type": "application/json;charset=UTF-8",
        }

        data = {
            "grant_type": "client_credentials",
            "appkey": KIWOOM_APPKEY,
            "secretkey": KIWOOM_SECRETKEY,
        }

        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()

        result = response.json()

        return {
            "success": True,
            "token": result.get("token"),
            "token_type": result.get("token_type"),
            "expires_dt": result.get("expires_dt"),
            "return_code": result.get("return_code"),
            "return_msg": result.get("return_msg"),
        }

    except requests.exceptions.RequestException as e:
        return {"error": f"토큰 갱신 API 요청 실패: {str(e)}"}
    except Exception as e:
        return {"error": f"토큰 갱신 실패: {str(e)}"}


# 도구 생성
kiwoom_get_access_token_tool = FunctionTool(get_access_token)
kiwoom_refresh_token_tool = FunctionTool(refresh_access_token)

# 도구들
KIWOOM_AUTH_TOOLS = [kiwoom_get_access_token_tool, kiwoom_refresh_token_tool]
