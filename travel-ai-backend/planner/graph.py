from langgraph.graph import StateGraph, START, END
from .state import PlannerState
from .nodes import *
from .conditions import check_weather_needed

def build_planner_graph():
    workflow = StateGraph(PlannerState)

    workflow.add_node("destination", destination_node)
    workflow.add_node("itinerary", itinerary_node)
    # workflow.add_node("budget", budget_node)
    # workflow.add_node("hotel", hotel_node)
    # workflow.add_node("transport", transport_node)
    workflow.add_node("weather", weather_node)
    workflow.add_node("event", event_node)
    workflow.add_node("highlight_images", highlight_images_node)

    workflow.add_edge(START, "destination")
    workflow.add_edge("destination", "highlight_images")
    workflow.add_edge("highlight_images", "itinerary")
    # workflow.add_edge("itinerary", "budget")
    # workflow.add_edge("budget", "hotel")
    # workflow.add_edge("hotel", "transport")

    # workflow.add_conditional_edges(
    #     "transport",
    #     check_weather_needed,
    #     {
    #         "weather": "weather",
    #         "end": END
    #     }
    # )

    workflow.add_edge("itinerary","weather")
    workflow.add_edge("weather","event")
    workflow.add_edge("event", END)

    return workflow.compile()
