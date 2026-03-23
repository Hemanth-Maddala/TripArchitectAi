from .state import PlannerState
from llm.gemini_client import call_gemini_json
from llm.unsplash_client import fetch_image_for_place
from llm.weather import get_current_weather
from llm.weather import get_forecast_weather
import json


async def destination_node(state: PlannerState):
    prompt = f"""
    Act as a travel expert. For the destination '{state['destination_input']}', 
    provide the full state,country,destination place name and a list of 3-5 top tourist highlights.
    Return JSON: {{"state": "string", "highlights": ["string"]}}
    """
    result = await call_gemini_json(prompt)
    return {"destination_data": result}

async def highlight_images_node(state: PlannerState):
    highlights = state["destination_data"]["highlights"]
    
    images = []
    for place in highlights:
        img_data = fetch_image_for_place(place)
        images.append(img_data)

    return {"highlight_images": images}

async def itinerary_node(state: PlannerState):
    dest = state["destination_data"].get("state", state["destination_input"])

    # 1. Get the pre-fetched images from state
    highlights = state.get("highlight_images", [])

    # 2. Build the list to show Gemini what images are available
    available_images = [
        {"title": h["place"], "url": h["image_url"]}
        for h in highlights
        if h.get("place") and h.get("image_url")
    ]

    # 3. Prompt: enforce clean titles + force image_url logic
    prompt = f"""
            Create a detailed travel itinerary for {state['travel_dates']} for {state['members']} people in {dest}.

                For each day, provide 2-3 activities.
                Each activity must be a JSON object with these exact keys:
                - "title": A short, clean place or activity name (e.g., "Howrah Bridge", "Victoria Memorial", "Abbey Falls"). 
                  Do NOT include words like Morning, Afternoon, Evening in the title.
                - "activity": The specific thing to do.
                - "about": A 2-3 line interesting description about the activity or the place.
                - "image_url": A URL string.

                I have already fetched some images for these places:
                {available_images}

                Rules for "image_url":
                - If the activity clearly matches one of the places in the list above, use the EXACT corresponding "url".
                - If there is NO suitable match in the list, set "image_url" to "FETCH".

                Return the result STRICTLY in this JSON format (no extra text, no explanation):
                {{
                  "Day 1": [
                    {{
                      "title": "Howrah Bridge",
                      "activity": "Visit Howrah Bridge and walk along the river",
                      "about": "Howrah Bridge is an iconic landmark of Kolkata...",
                      "image_url": "FETCH"
                    }}
                  ],
                  "Day 2": [
                    ...
                  ]
                }}
            """

    itinerary = await call_gemini_json(prompt)

    # 4. Post-process: only fetch images when Gemini says "FETCH"
    for day, activities in itinerary.items():
        for activity in activities:
            if activity.get("image_url") == "FETCH":
                img_data = fetch_image_for_place(activity.get("title", ""))
                activity["image_url"] = img_data.get("url") if img_data else None

    return {"itinerary": itinerary}


async def transport_node(state: PlannerState):
    # 1. Get the starting location from the state
    origin = state.get("starting_location")
    
    # 2. Get the destination (using destination_data if available, else destination_input)
    dest = state["destination_data"].get("state", state.get("destination_input"))
    
    # 3. Get the number of members
    members = state.get("members", 1)

    # 4. Create a more detailed prompt including the origin
    prompt = f"""
    Suggest the best way to travel from {origin} to {dest} and provide local transport options 
    at the destination for {members} people.
    
    Consider the distance and suggest suitable intercity modes (flight, train, or car) 
    and local modes (metro, taxi, or rentals).

    Return exactly this JSON format:
    {{
        "intercity": "Detailed suggestion for traveling from {origin} to {dest}",
        "local": "Suggestions for getting around within {dest}"
    }}
    """
    
    # 5. Call the model and update the state
    result = await call_gemini_json(prompt)
    return {"transport": result}

async def weather_node(state: PlannerState):
    # 1. Extract inputs from state
    full_city = state.get("destination_input")
    cities = full_city.split()
    city = cities[0]

    month = state.get("month_input", "the current season")
    
    current_raw = None
    forecast_raw = None
    lat, lon = None, None

    # 2. Try to fetch real-time data
    try:
        current_raw = get_current_weather(city)
        # Extract coordinates from the API response
        if current_raw and "coord" in current_raw:
            lat = current_raw.get("coord", {}).get("lat")
            lon = current_raw.get("coord", {}).get("lon")
            
            # If coordinates are valid, get the 5-day forecast
            if lat and lon:
                forecast_raw = get_forecast_weather(lat, lon)
    except Exception as e:
        print(f"API Fetch Error: {e}")

    # 3. Logic Branching for Gemini Prompt
    if lat and lon:
        # PATH A: Live Data Available
        prompt = f"""
        According to the weather in {city} in {month} and the following real-time data:
        
        CURRENT WEATHER: {json.dumps(current_raw)}
        5-DAY FORECAST: {json.dumps(forecast_raw)}
        
        Based on this live data:
        1. Summarize the current condition and how it aligns with typical {month} weather.
        2. Provide a 5-day outlook (mention specific trends).
        3. Give 3 precautions or clothing advice for travelers.
        
        Return JSON:
{{
    "current_weather": "string",
    "five_day_forecast": "string",
    "advice": ["string","string","string"],
    "source": "RapidApi-OpenWeather and Seasonal_Knowledge",
    "raw_current": {json.dumps({
        "weather": current_raw.get("weather"),
        "base": current_raw.get("base")
    })}
}}
        """
    else:
        # PATH B: Fallback to Seasonal Knowledge
        prompt = f"""
        I couldn't fetch live data, so please provide information according to the typical weather in {city} during {month}.
        
        1. Describe the typical weather conditions for this time of year.
        2. Provide 3 specific precautions or clothing advice for travelers.
        
        Return JSON:
        {{
            "current_weather": "Typical conditions for {month}",
            "five_day_forecast": "Seasonal averages apply",
            "advice": ["string"],
            "source": "seasonal_knowledge",
            "raw_current": {json.dumps({
    "weather": current_raw.get("weather") if current_raw else None,
    "base": current_raw.get("base") if current_raw else None
})}
        }}
        """

    # 4. Call Gemini and return result
    result = await call_gemini_json(prompt)
    # "raw_forecast": {json.dumps(forecast_raw)}

    # print("result data" , result)
    
    return {"weather": result}


# --- Event Node ---

async def event_node(state: PlannerState):
    dest = state["destination_data"].get("state", state.get("destination_input"))
    month = state.get("month_input", "the current season")
    prompt = f"""
    Identify the top 3 most significant events or festivals that occur in {dest} during {month}.
    Return the response strictly as a JSON list of objects. 
    Each object must have "title" and "description" keys.
    
    Example format:
    [
      {{"title": "Festival Name/ Event Name", "description": "Brief 2-line description"}},
      ...
    ]
    """
    events_list = await call_gemini_json(prompt)

    # 2. Fetch images for each event title and build the final dictionary
    event_data_with_images = {}
    
    for item in events_list[:3]:
        title = item.get("title")
        description = item.get("description")
        
        image_url = fetch_image_for_place(title)
        
        event_data_with_images[title] = {
            "description": description,
            "image_url": image_url if image_url else None
        }

    print(event_data_with_images)

    return {"event": event_data_with_images}
