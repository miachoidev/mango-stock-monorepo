from google.adk.agents import Agent
from .prompt import SUPPLY_DEMAND_ANALYZER_INSTR
from stock.utils.tools.kiwoom_supply_demand_tools import KIWOOM_SUPPLY_DEMAND_TOOLS


def create_agent():
    return Agent(
        model="gemini-2.5-flash",
        name="supply_demand_analyzer_agent",
        description="A Supply Demand Analyzer Agent for analyzing institutional and foreign trading trends",
        instruction=SUPPLY_DEMAND_ANALYZER_INSTR,
        tools=[
            *KIWOOM_SUPPLY_DEMAND_TOOLS,  # 수급 관련 모든 도구들 (외국인기관매매상위요청 포함)
        ],
    )


supply_demand_analyzer_agent = create_agent()
