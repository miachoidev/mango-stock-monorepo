from google.adk.agents import Agent
from .prompt import VOLUME_ANALYZER_INSTR

# from stock.utils.tools.kiwoom_chart_tools import KIWOOM_CHART_TOOLS
from stock.utils.tools.kiwoom_ranking_tools import KIWOOM_RANKING_TOOLS
# from stock.utils.tools.kiwoom_market_tools import KIWOOM_MARKET_TOOLS


def create_agent():
    return Agent(
        model="gemini-2.5-flash",
        name="volume_analyzer_agent",
        description="A Volume Analyzer Agent for analyzing trading volume and value trends",
        instruction=VOLUME_ANALYZER_INSTR,
        tools=[
            # *KIWOOM_CHART_TOOLS,  # 차트 관련 도구들 (일봉, 분봉 등)
            *KIWOOM_RANKING_TOOLS,  # 순위정보 관련 도구들 (거래량급증, 거래량상위, 거래대금상위, 등락률상위, 예상체결등락률상위)
            # *KIWOOM_MARKET_TOOLS,  # 시세정보 관련 도구들 (기관매매추이, 공매도추이 등)
        ],
    )


volume_analyzer_agent = create_agent()
