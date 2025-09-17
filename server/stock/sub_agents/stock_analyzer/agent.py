from google.adk.agents import Agent
from .prompt import STOCK_ANALYZER_INSTR
from stock.utils.tools.kiwoom_account_tools import kiwoom_account_evaluation_tool
from stock.utils.tools.kiwoom_chart_tools import kiwoom_stock_daily_chart_tool
from stock.utils.tools.kiwoom_market_tools import (
    kiwoom_stock_institution_trading_trend_tool,
    kiwoom_short_selling_trend_tool,
)
from stock.utils.tools.kiwoom_stock_info_tools import (
    kiwoom_stock_basic_info_tool,
    kiwoom_stock_daily_program_trading_trend_tool,
)
from stock.utils.tools.kiwoom_sector_tools import kiwoom_sector_current_price_tool


# 보유 주식 분석 클릭시 해당 에이전트 실행
# 프론트에서 해당 종목 코드 전달 필요함.
def create_agent():
    return Agent(
        model="gemini-2.5-flash",
        name="stock_analyzer_agent",
        description="A Stock Analyzer Agent for stock analysis",
        instruction=STOCK_ANALYZER_INSTR,
        tools=[
            kiwoom_account_evaluation_tool,  # 계좌평가현황요청 (kt00004)
            kiwoom_stock_basic_info_tool,  # 주식기본정보요청 (ka10001)
            kiwoom_stock_daily_chart_tool,  # 주식일봉차트조회요청 (ka10081)
            kiwoom_stock_institution_trading_trend_tool,  # 종목별기관매매추이요청 (ka10045)
            kiwoom_stock_daily_program_trading_trend_tool,  # 종목일별프로그램매매추이요청 (ka90013)
            kiwoom_short_selling_trend_tool,  # 공매도추이요청 (ka10014)
            kiwoom_sector_current_price_tool,  # 업종(섹터)현재가요청 (ka20001)
        ],
    )


stock_analyzer_agent = create_agent()
