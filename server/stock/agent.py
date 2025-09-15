from google.adk.agents import Agent

from stock.prompt import ROOT_AGENT_INSTR
from stock.sub_agents.stock_analyzer.agent import stock_analyzer_agent
from stock.sub_agents.sector_analyzer.agent import sector_analyzer_agent
from stock.sub_agents.supply_demand_analyzer.agent import supply_demand_analyzer_agent


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
            # volume_analyzesr_agent,
            # trading_recommander_agent,
        ],
        tools=[],  # 서브 에이전트들이 각자 필요한 툴을 가지고 있음
    )


root_agent = create_stock_agent()
