from google.adk.agents import Agent
from .prompt import VOLUME_ANALYZER_INSTR
from stock.utils.tools.kiwoom_auth_tools import kiwoom_get_access_token_tool
from stock.utils.tools.kiwoom_chart_tools import (
    kiwoom_stock_daily_chart_tool,
    kiwoom_stock_minute_chart_tool,
)
from stock.utils.tools.kiwoom_ranking_tools import (
    kiwoom_volume_ranking_tool,
    kiwoom_trading_value_ranking_tool,
    kiwoom_price_change_ranking_tool,
)
from stock.utils.tools.kiwoom_market_tools import (
    kiwoom_market_trading_trend_tool,
)


def create_agent():
    return Agent(
        model="gemini-2.5-flash",
        name="volume_analyzer_agent",
        description="A Volume Analyzer Agent for analyzing trading volume and value trends",
        instruction=VOLUME_ANALYZER_INSTR,
        tools=[
            kiwoom_get_access_token_tool,  # 토큰 발급 (먼저 실행 필요)
            kiwoom_stock_daily_chart_tool,  # 주식일봉차트조회요청 (ka10081)
            kiwoom_stock_minute_chart_tool,  # 주식분봉차트조회요청 (ka10082)
            kiwoom_volume_ranking_tool,  # 거래량순위요청 (ka10050)
            kiwoom_trading_value_ranking_tool,  # 거래대금순위요청 (ka10051)
            kiwoom_price_change_ranking_tool,  # 상승률순위요청 (ka10052)
            kiwoom_market_trading_trend_tool,  # 시장거래추이요청 (ka10049)
        ],
    )


volume_analyzer_agent = create_agent()
