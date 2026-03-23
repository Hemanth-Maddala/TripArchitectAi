from typing import TypedDict, Optional, Dict, Any

class PlannerState(TypedDict):
    destination_input: str
    starting_location: str
    budget_input: float
    travel_dates: str
    members: int
    month_input: Optional[str]

    destination_data: Optional[Dict]
    itinerary: Optional[Dict]
    # budget_analysis: Optional[Dict]
    # hotel: Optional[Dict]
    # transport: Optional[Dict]
    weather: Optional[Dict]
    event : Optional[Dict]
    highlight_images: Optional[list]

