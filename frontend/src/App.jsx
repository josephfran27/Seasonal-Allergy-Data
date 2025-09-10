import { useState } from 'react'
import { GiLindenLeaf } from "react-icons/gi";
import './App.css'

function App() {
  const [location, setLocation] = useState({ lat: '', lon: ' '})
  const [pollenData, setPollenData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [locationName, setLocationName] = useState('')

  const handleSubmit = () => {
    if(location.lat && location.lon) {
      fetchPollenData(location.lat, location.lon)
    }
  }

  return (
    <div className="app-container">
      <div className="header">
        <GiLindenLeaf className="header-icon"/>
        <h1>Pollen Data</h1>
        <h3>Enter your location for summary of the pollen/allergens around you!</h3>
      </div>

      <div className="input-section">
        <div className="input-grid">
          <div className="input-group">
            <label>Latitude</label>
            <input
              type="number"
              placeholder="Input latitude"
              step="any"
              value={location.lat}
            />
            <label>Longitude</label>
            <input
              type="number"
              placeholder="Input longitude"
              step="any"
              value={location.lon}
            />
          </div>
        </div>

        <div className="button-group">
          <button 
            onClick={handleSubmit}
            disabled={loading || !location.lat || !location.lon}
            className='submit-location-button'
          >
            {loading ? (
              <>Fetching Pollen Data...</>
            ) : (
              <>
                Get Pollen Data
              </>
            )}
          </button>

          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className='current-location-button'
          >
            Use my location
          </button>
        </div>

        {/* insert stuff for after location is found */}
      </div>
      <p className="little-green-text">
        Hopefully you can learn something from this!
      </p>
    </div>
  )
}

export default App
