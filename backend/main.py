#FastAPI entry point
from fastapi import FastAPI, Query
from services import get_pollen_data, parse_pollen_response, find_location

app = FastAPI()

@app.get("/predict")
def predict(lat: float = Query(...), lon: float = Query(...)):
    data = get_pollen_data(lat, lon)
    if "error" in data:
        return "Error: Failed to fetch pollen data."
    
    parsed = parse_pollen_response(data)
    state, city = find_location(lat, lon)
    return {"State": state, "City": city, "pollen": parsed}


