import { useState } from 'react'
import { GiLindenLeaf } from "react-icons/gi";
import './App.css'

function App() {
  const [location, setLocation] = useState({ lat: '', lon: ' '})
  const [pollenData, setPollenData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [locationName, setLocationName] = useState('')

  const API_BASE_URL = 'http://localhost:8000'

  const getCurrentLocation = () => {
    // error handling for if geolocation doesn't work
    if(!navigator.geolocation) {
      setError("This browswer doesn't support geolocation.")
      return
    }

    //get location
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6)
        const lon = position.coords.longitude.toFixed(6)
        setLocation({ lat, lon })
        fetchPollenData(lat, lon)
      },
      //for location fetching failure
      (error) => {
        setError('Unable to set your location.')
        setLoading(false)
      }
    )
  }

  const fetchPollenData = async (lat, lon) => {
    // error handling for invalid coordinates
    if(!lat || !lon) {
      setError('Please enter valid coordinates.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/predict?lat=${lat}&lon=${lon}`)

      // error handling for fetch failure
      if(!response.ok) {
        throw new Error('Failed to fetch pollen data.')
      }

      const data = response.json()

      // error handling for improper data response
      if(typeof data === 'string' && data.includes('Error')) {
        throw new Error(data)
      }

      setPollenData(data)
      setLocationName(`${data.City}, ${data.State}`)
    }
    // error check for failur fetching pollen data
    catch (err) {
      setError(err.message || 'Failed to fetch pollen data.')
      setPollenData(null)
    }
    finally {
      setLoading(false)
    }
  }

  //handles location submission
  const handleSubmit = () => {
    if(location.lat && location.lon) {
      fetchPollenData(location.lat, location.lon)
    }
  }

  return (
    <div className="app-container">
      {/* page header */}
      <div className="header">
        <GiLindenLeaf className="header-icon"/>
        <h1>Pollen Data</h1>
        <h3>Enter your location for summary of the pollen/allergens around you!</h3>
      </div>

      {/* location input section */}
      <div className="input-section">
        <div className="input-grid">
          <div className="input-group">
            <label>Latitude</label>
            <input
              type="number"
              placeholder="Input latitude"
              step="any"
              value={location.lat}
              onChange={(e) => setLocation({...location, lat: e.target.value})}
            />
            <label>Longitude</label>
            <input
              type="number"
              placeholder="Input longitude"
              step="any"
              value={location.lon}
              onChange={(e) => setLocation({...location, lon: e.target.value})}
            />
          </div>
        </div>

        {/* location submission & current location button */}
        <div className="button-group">
          <button 
            onClick={handleSubmit}
            disabled={loading || !location.lat || !location.lon}
            className='submit-location-button'
          >
            {loading ? 'Fetching Pollen Data...' : 'Get Pollen Data'}
          </button>

          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className='current-location-button'
          >
            Use my location
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span>Error: {error}</span>
          </div>
        )}

        {/* insert stuff for after location is found */}
      </div>
      <p className="little-green-text">
        Hopefully you can learn something from this!
      </p>
    </div>
  )
}

export default App
