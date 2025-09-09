#FastAPI entry point
from fastapi import FastAPI, Query
from services import get_pollen_data

app = FastAPI()

@app.get("/predict")
def predict(lat: float = Query(...), lon: float = Query(...)):
    data = get_pollen_data(lat, lon)

    print(data)
    if "error" in data:
        return "Error: Failed to fetch pollen data."


