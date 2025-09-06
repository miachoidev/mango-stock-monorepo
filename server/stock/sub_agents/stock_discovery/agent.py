from google.adk.agents import Agent
from google.adk.tools import AgentTool

from stock.utils.tools.google_search_agent import google_search_agent
from .prompt import STOCK_DISCOVERY_INSTR


def create_agent():
    return Agent(
        model="gemini-2.5-pro",
        name="stock_discovery_agent",
        description="A Stock Discovery Agent for discovering new promising stocks using Google search",
        instruction=STOCK_DISCOVERY_INSTR,
        tools=[AgentTool(agent=google_search_agent)],
    )


stock_discovery_agent = create_agent()
