from google.adk.agents import Agent
from google.adk.tools import google_search


google_search_agent = Agent(
    model="gemini-2.0-flash-exp",
    name="google_search_agent",
    instruction="""
    You're a specialist in Google Search
    """,
    tools=[google_search],
)
