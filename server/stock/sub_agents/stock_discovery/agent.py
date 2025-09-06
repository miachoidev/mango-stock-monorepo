from google.adk.agents import Agent
from google.adk.tools import google_search
from .prompt import STOCK_DISCOVERY_INSTR


def create_agent():
    return Agent(
        model="gemini-2.5-flash",
        name="stock_discovery_agent",
        description="A Stock Discovery Agent for discovering new promising stocks using Google search",
        instruction=STOCK_DISCOVERY_INSTR,
        tools=[google_search],
    )


stock_discovery_agent = create_agent()
