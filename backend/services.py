import requests
import os
from dotenv import load_dotenv
from geopy.geocoders import Nominatim

# -- API VARIABLES --
#loads .env variables (API Key)
load_dotenv()

#variables for accessing google's pollen api
API_KEY = os.getenv("API_KEY")
BASE_URL = "https://pollen.googleapis.com/v1/forecast:lookup"


# -- SERVICE FUNCTIONS --
#Primary function for fetching the pollen forcast from Google's Pollen API.
def get_pollen_data(lat: float, lon: float, days: int = 1):
    #gets converted to query parameters in the URL for the full URL
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

#Parses the API response into a cleaner format and creates a user friendly dict of results.
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
        recommendations = pollen_type.get("healthRecommendations")

        result.append({
            "Allergen/Pollen Name": name,
            "In Season?": in_season,
            "Severity Index (0-5)": value,
            "Severity Description": category,
            "Suggestions": recommendations
        })

    return result

#Uses python's geolocator to take the lat and lon passed by the user and return their city and state.
def find_location(lat, lon):
    geolocator = Nominatim(user_agent="my_city")

    location = geolocator.reverse(f"{lat}, {lon}", language="en")
    address_components = location.raw['address']

    user_state = address_components.get('state')

    user_city = (
        address_components.get('city')
        or address_components.get('town')
        or address_components.get('county')
        or "Unknown"
    )
    return user_state, user_city