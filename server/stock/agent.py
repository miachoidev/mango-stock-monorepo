from google.adk.agents import Agent

from stock.sub_agents.content_reviewer.agent import content_reviewer_agent
from stock.sub_agents.content_writer.agent import content_writer_agent
from stock.prompt import ROOT_AGENT_INSTR

from stock.utils.mcp.load_web_tool import load_web_tool
from stock.utils.mcp.payment_agent import payment_agent_tool
from stock.utils.mcp.weather_agent import weather_agent


def create_marketer_agent():

    tools = [load_web_tool, payment_agent_tool, weather_agent]

    return Agent(
        model="gemini-2.5-flash",
        name="marketer_agent",
        description="A Marketing AI using the services of multiple sub-agents",
        instruction=ROOT_AGENT_INSTR,
        sub_agents=[
            content_reviewer_agent,
            content_writer_agent,
        ],
        tools=tools,
    )


root_agent = create_marketer_agent()
