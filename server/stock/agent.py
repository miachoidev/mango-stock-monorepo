from google.adk.agents import Agent

from stock.prompt import ROOT_AGENT_INSTR
from stock.sub_agents.stock_analyzer.agent import stock_analyzer_agent
from stock.sub_agents.stock_discovery.agent import stock_discovery_agent
from stock.sub_agents.trading_recommander.agent import trading_recommander_agent
from stock.utils.tools import ALL_KIWOOM_TOOLS


def create_stock_agent():
    return Agent(
        model="gemini-2.5-flash",
        name="stock_agent",
        description="A Stock AI using the services of multiple sub-agents",
        instruction=ROOT_AGENT_INSTR,
        sub_agents=[
            stock_analyzer_agent,
            stock_discovery_agent,
            trading_recommander_agent,
        ],
        tools=ALL_KIWOOM_TOOLS,
    )


root_agent = create_stock_agent()
