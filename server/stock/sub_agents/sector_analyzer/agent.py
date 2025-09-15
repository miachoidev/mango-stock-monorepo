from google.adk.agents import Agent
from .prompt import SECTOR_ANALYZER_INSTR
from stock.utils.tools.kiwoom_auth_tools import kiwoom_get_access_token_tool
from stock.utils.tools.kiwoom_sector_tools import KIWOOM_SECTOR_TOOLS
from stock.utils.tools.kiwoom_theme_tools import KIWOOM_THEME_TOOLS


def create_agent():
    return Agent(
        model="gemini-2.5-flash",
        name="sector_analyzer_agent",
        description="A Sector Analyzer Agent for analyzing industry and theme performance",
        instruction=SECTOR_ANALYZER_INSTR,
        tools=[
            kiwoom_get_access_token_tool,  # 토큰 발급 (먼저 실행 필요)
            *KIWOOM_SECTOR_TOOLS,  # 섹터 관련 모든 도구들
            *KIWOOM_THEME_TOOLS,  # 테마 관련 모든 도구들
        ],
    )


sector_analyzer_agent = create_agent()
