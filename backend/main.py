from fastapi import FastAPI, Query
from services import get_pollen_data, parse_pollen_response, find_location
from fastapi.middleware.cors import CORSMiddleware

# create FastAPI instance
app = FastAPI()

# connects frontend and backend 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#API endpoint to get the pollen data for a given location.
#Query(...)... declare query parameters for endpoint (what comes after the ? in a URL)
@app.get("/predict")
def predict(lat: float = Query(...), lon: float = Query(...)): 
    #fetch pollen data
    data = get_pollen_data(lat, lon)
    if "error" in data:
        return "Error: Failed to fetch pollen data."
    
    #Parse pollen data
    parsed = parse_pollen_response(data)

    #Get user location info
    state, city = find_location(lat, lon)

    return {"State": state, "City": city, "pollen": parsed}


