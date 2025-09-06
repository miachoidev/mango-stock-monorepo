from google.adk.agents import Agent
from .prompt import STOCK_ANALYZER_INSTR


def create_agent():
    return Agent(
        model="gemini-2.5-flash",
        name="stock_analyzer_agent",
        description="A Stock Analyzer Agent for stock analysis",
        instruction=STOCK_ANALYZER_INSTR,
    )


stock_analyzer_agent = create_agent()
