import requests

def get_pollen_data():
    key = "your_api_key"
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