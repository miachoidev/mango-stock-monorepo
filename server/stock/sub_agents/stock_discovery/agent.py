from google.adk.agents import Agent
from .prompt import STOCK_DISCOVERY_INSTR


def create_agent():
    return Agent(
        model="gemini-2.5-flash",
        name="stock_discovery_agent",
        description="A Stock Discovery Agent for stock discovery",
        instruction=STOCK_DISCOVERY_INSTR,
    )


stock_discovery_agent = create_agent()
