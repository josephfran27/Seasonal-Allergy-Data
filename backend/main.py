#FastAPI entry point
import os
from dotenv import load_dotenv
import requests
from fastapi import FastAPI

#loads .env variables
load_dotenv()

#variables for accessing api
API_KEY = os.getenv("API_KEY")
BASE_URL = "https://pollen.googleapis.com/v1/forecast:lookup"

app = FastAPI()

@app.get("/predict")
def predict(lat: float, lon: float):
    params = {
        "key": API_KEY,
        "location.latitude": lat,
        "location.longitude": lon,
        "days": 1
    }

    response = requests.get(BASE_URL, params=params)

    if response.status_code != 200:
        return "Error fetching pollen data."
    
    data = response.json()

    print(data)
    return data

