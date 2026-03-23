from .state import PlannerState
from llm.gemini_client import call_gemini_json

async def check_weather_needed(state: PlannerState):
    if state.get("month_input"):
        return "weather"

    prompt = f"""
    Is weather a critical factor for a trip to {state['destination_input']}?
    Return JSON: {{ "critical": true/false }}
    """

    result = await call_gemini_json(prompt)

    if result.get("critical"):
        return "weather"
    return "end"