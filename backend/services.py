import requests
import os
from dotenv import load_dotenv

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
        "days": 1
    }

    response = requests.get(BASE_URL, params=params)

    if response.status_code != 200: 
        return "Error fetching pollen data."
    
    print(response.json())

    return response.json()