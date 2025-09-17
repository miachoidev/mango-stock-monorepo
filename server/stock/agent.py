from google.adk.agents import Agent

from stock.prompt import ROOT_AGENT_INSTR
from stock.sub_agents.stock_analyzer.agent import stock_analyzer_agent
from stock.sub_agents.sector_analyzer.agent import sector_analyzer_agent
from stock.sub_agents.supply_demand_analyzer.agent import supply_demand_analyzer_agent
from stock.sub_agents.volume_analyzer.agent import volume_analyzer_agent
from stock.utils.tools.kiwoom_auth_tools import kiwoom_get_access_token_tool


def create_stock_agent():
    return Agent(
        model="gemini-2.5-flash",
        name="stock_agent",
        description="A Stock AI using the services of multiple sub-agents",
        instruction=ROOT_AGENT_INSTR,
        sub_agents=[
            stock_analyzer_agent,
            sector_analyzer_agent,
            supply_demand_analyzer_agent,
            volume_analyzer_agent,
        ],
        tools=[
            kiwoom_get_access_token_tool,  # 🔑 키움 API 토큰 발급 (마스터에서 먼저 실행)
        ],
    )


root_agent = create_stock_agent()
