from fastapi import APIRouter
from planner.graph import build_planner_graph

router = APIRouter()
planner = build_planner_graph()

@router.get("/")
async def health_check():
    return {"status": "ok"}


@router.post("/plan-trip")
async def plan_trip(user_input: dict):
    # user_raw_data = {
    #     "destination_input": "ooty bengaluru",
    #     "starting_location": "hyderabad",
    #     "budget_input": 20000,
    #     "travel_dates": "2 march 2026",
    #     "members": 1,
    #     "month_input": "march"
    # }
    result = await planner.ainvoke(user_input)
    # result = await planner.ainvoke(user_raw_data)
    return result
