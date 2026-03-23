import os
import requests
from dotenv import load_dotenv

load_dotenv()
UNSPLASH_KEY = os.getenv("UNSPLASH_ACCESS_KEY")

def fetch_image_for_place(place: str):
    url = "https://api.unsplash.com/search/photos"
    params = {
        "query": place,
        "per_page": 1,
        "client_id": UNSPLASH_KEY
    }
    
    r = requests.get(url, params=params).json()
    
    if r["results"]:
        img = r["results"][0]
        return {
            "place": place,
            "image_url": img["urls"]["regular"]
        }
    
    return {
        "place": place,
        "image_url": None
    }