# async def itinerary_node(state: PlannerState):
#     dest = state["destination_data"].get("state", state['destination_input'])
    
#     # Updated prompt with specific structure instructions
#     prompt = f"""
#     Create a detailed travel itinerary for {state['travel_dates']} for {state['members']} people in {dest}.
    
#     For each day, provide 2-3 activities. 
#     Each activity must be a JSON object with these exact keys:
#     - "title": A short, catchy name for the activity.
#     - "activity": The specific thing to do (e.g., "Visit the Eiffel Tower" or Any Specific activity the traveller should do).
#     - "about": A 2-3 line interesting description about the activity or the place.

#     Return the result strictly in this JSON format:
#     {{
#       "Day 1": [
#         {{
#           "title": "Morning Landmark Visit",
#           "activity": "...",
#           "about": "..."
#         }},
#         ...
#       ],
#       "Day 2": [...]
#     }}
#     """
#     result = await call_gemini_json(prompt)
    
#     return {"itinerary": result}




# --- Weather Logic ---
# async def weather_node(state: PlannerState):
#     dest = state["destination_data"].get("state", state['destination_input'])
#     month = state.get("month_input", "current season")
#     prompt = f"""
#     What is the weather in {dest} during {month}? 
#     Give 2 pieces of clothing advice for {state['members']} travelers.
#     Return JSON: {{"condition": "string", "advice": ["string"]}}
#     """
#     result = await call_gemini_json(prompt)
#     return {"weather": result}



# --- Conditional Logic ---

# async def check_weather_needed(state: PlannerState):
#     if state.get("month_input"):
#         return "weather"

#     prompt = f"""
#     Is weather a critical factor for a trip to {state['destination_input']}?
#     Return JSON: {{ "critical": true/false }}
#     """

#     result = await call_gemini_json(prompt)

#     if result.get("critical"):
#         return "weather"
#     return "end"


# --- hotel logic ---

# async def hotel_node(state: PlannerState):
#     dest = state["destination_data"].get("state", state['destination_input'])
#     prompt = f"""
#     Suggest accommodation in {dest} for {state['members']} people.
#     Base suggestions on a total trip budget of {state['budget_input']}.
#     Return JSON: {{"type": "string", "avgCostPerNight": number, "recommendation": "string"}}
#     """
#     result = await call_gemini_json(prompt)
#     return {"hotel": result}


# --- budget logic ---

# async def budget_node(state: PlannerState):
#     # Analyzes if the user's input budget is sufficient for the destination/members
#     dest = state["destination_data"].get("state", state['destination_input'])
#     prompt = f"""
#     A group of {state['members']} is traveling to {dest} for {state['travel_dates']}.
#     Their total budget is INR {state['budget_input']}.
#     Estimate if this budget is 'low', 'sufficient', or 'luxury' for this trip.
#     Provide a breakdown of estimated costs.
#     Return JSON: {{"analysis": "string", "estimated_total": number, "status": "string"}}
#     """
#     result = await call_gemini_json(prompt)
#     return {"budget_analysis": result}