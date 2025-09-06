from google.adk.agents import Agent
from .prompt import TRADING_RECOMMENDATION_INSTR


def create_agent():
    return Agent(
        model="gemini-2.5-flash",
        name="trading_recommander_agent",
        description="A Trading Recommander Agent for trading recommander",
        instruction=TRADING_RECOMMENDATION_INSTR,
        tools=[],
    )


trading_recommander_agent = create_agent()
