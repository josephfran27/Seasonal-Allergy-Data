import requests

def get_pollen_data():
    key = "https://pollen.googleapis.com/v1/forecast:lookup?key=AIzaSyBXARzX-m2kNyGHjaYB3RWGqjXjQT-zBuo&location.longitude=35.32&location.latitude=32.32&days=1"
    response = requests.get(key)

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        return response.status_code
    
pollen = get_pollen_data()
if pollen is not None:
    print(pollen)
else:
    print("Failed to retrieve pollen data.")