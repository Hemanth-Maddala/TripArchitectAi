import os
import requests

from dotenv import load_dotenv
load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST = os.getenv("x-rapidapi-host")

def get_current_weather(city):
    URL_CURRENT = "https://open-weather13.p.rapidapi.com/city"
    headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST
    }
    params = {
        "city": city
    }

    response = requests.get(url=URL_CURRENT,headers=headers,params=params)
    return response.json()

def get_forecast_weather(lat,lon) :
    URL_FORECAST = "https://open-weather13.p.rapidapi.com/fivedaysforcast"
    headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST
    }
    params = {
        "latitude": lat,
        "longitude": lon
    }

    response = requests.get(url=URL_FORECAST,headers=headers,params=params)
    return response.json()