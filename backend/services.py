import requests
import os
from dotenv import load_dotenv
from geopy.geocoders import Nominatim

#loads .env variables
load_dotenv()

#variables for accessing api
API_KEY = os.getenv("API_KEY")
BASE_URL = "https://pollen.googleapis.com/v1/forecast:lookup"

def get_pollen_data(lat: float, lon: float, days: int = 1):
    params = {
        "key": API_KEY,
        "location.latitude": lat,
        "location.longitude": lon,
        "days": days
    }

    response = requests.get(BASE_URL, params=params)

    if response.status_code != 200: 
        return "Error fetching pollen data."
    

    return response.json()

def parse_pollen_response(data):
    result = []

    daily_info = data.get("dailyInfo", [])
    if not daily_info:
        return []

    for pollen_type in daily_info[0].get("pollenTypeInfo", []):
        name = pollen_type.get("displayName", "Unknown")
        in_season = pollen_type.get("inSeason", False)
        index_info = pollen_type.get("indexInfo", {})
        value = index_info.get("value", 0)
        category = index_info.get("category", "Unknown")
        recommendations = pollen_type.get("healthRecommendations", [])

        result.append({
            "name": name,
            "in_season": in_season,
            "value": value,
            "category": category,
            "reccomendations": recommendations
        })

    return result

def find_location(lat, lon):
