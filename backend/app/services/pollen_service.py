import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_POLLEN_API_KEY")
BASE_URL = "https://pollen.googleapis.com/v1/forecast:lookup"

def get_pollen_data(lat: float, lon: float, days: int = 1):
    url = f"{BASE_URL}?key={API_KEY}&location.longitude={lon}&location.latitude={lat}&days={days}"
    response = requests.get(url)

    if response.status_code == 200:
        return response.json()
    else:
        return {"Error fetching response": response.status_code}
