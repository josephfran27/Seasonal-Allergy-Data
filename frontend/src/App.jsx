import { useState } from 'react'
import { GiLindenLeaf } from "react-icons/gi";
import './App.css'

function App() {
  const [location, setLocation] = useState({ lat: '', lon: ''})
  const [pollenData, setPollenData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [locationName, setLocationName] = useState('')

  //FastAPI backend URL
  const API_BASE_URL = 'http://localhost:8000'

  // Colors pollen category based on severity, improves UI
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'very_high' : return '#dc143c'
      case 'high' : return '#dc143c'
      case 'medium' : return '#ff7f50'
      case 'low' : return '#2e8b57'
      case 'very_low' : return '#2e8b57'
      default: return '#c0c0c0'
    }
  }

  // Converts category description to clean text
  const getCategoryText = (category) => {
    switch(category?.toLowerCase()) {
      case 'very_high' : return 'Very High'
      case 'high' : return 'High'
      case 'medium' : return 'Medium'
      case 'low' : return 'Low'
      case 'very_low' : return 'Very Low'
      default: return 'Unknown'
    }
  }

  //Gets user's current location using geolocation
  const getCurrentLocation = () => {
    // error handling for if geolocation doesn't work
    if(!navigator.geolocation) {
      setError("This browser doesn't support geolocation.")
      return
    }

    //get user's current location
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
        setError('Unable to get your location.')
        setLoading(false)
      }
    )
  }

  //Fetches pollen data from the backend
  const fetchPollenData = async (lat, lon) => {
    // error handling for invalid coordinates
    if(!lat || !lon) {
      setError('Please enter valid coordinates.')
      return
    }

    setLoading(true)
    setError('')

    try {
      //API call
      const response = await fetch(`${API_BASE_URL}/predict?lat=${lat}&lon=${lon}`)

      // error handling for fetch failure
      if(!response.ok) {
        throw new Error('Failed to fetch pollen data.')
      }

      const data = await response.json()

      if(data.error) {
        throw new Error(data.error)
      }

      // error handling for improper data response
      if(typeof data === 'string' && data.includes('Error')) {
        throw new Error(data)
      }

      setPollenData(data)
      setLocationName(`${data.City}, ${data.State}`)
    }
    // error check for failure fetching pollen data
    catch (err) {
      setError(err.message || 'Failed to fetch pollen data.')
      setPollenData(null)
    }
    finally {
      //stop loading when done
      setLoading(false)
    }
  }

  //handles manual location submission
  const handleSubmit = () => {
    if(location.lat && location.lon) {
      fetchPollenData(location.lat, location.lon)
    }
  }

  return (
    <div className="app-container">
      {/* page header */}
      <div className="header">
        <h1><GiLindenLeaf/>   Pollen Data   </h1>
        <h3>Enter your location for summary of the pollen/allergens around you!</h3>
      </div>

      {/* location input section */}
      <div className="input-section">
        <div className="input-group">
          <div className="input-field">
            <label>Latitude</label>
            <input
              type="number"
              placeholder="Input latitude"
              step="any"
              value={location.lat}
              onChange={(e) => setLocation({...location, lat: e.target.value})}
            />
          </div>
          <div className="input-field">
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
            {loading ? 'Fetching Pollen Data...' : 'Submit Coordinates'}
          </button>

          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className='current-location-button'
          >
            Use current location
          </button>
        </div>

        {/* error display for location issues */}
        {error && (
          <div className="error-message">
            <span>Error: {error}</span>
          </div>
        )}
      </div>

      {/* Results section for when pollen data is acquired */}
      {pollenData && (
        <div className="results-section">
          <div className="results-header">
            <h2>Pollen Forecast in {locationName}</h2>
            <p>Current pollen levels and health recommendations:</p>
          </div>

          <div className="pollen-grid">
            {pollenData.pollen && pollenData.pollen.length > 0 ? (
              // map through and display each pollen type and severity
              pollenData.pollen.map((pollen, index) => (
                <div key={index} className="pollen-card">
                  <div className="pollen-header">
                    <div className="pollen-title">
                      <h3>{pollen.name}</h3>
                    </div>
                    <div className="pollen-stats">
                      <span
                        className='category-badge'
                        style={{backgroundColor: getCategoryColor(pollen.category)}}
                      >
                        {getCategoryText(pollen.category)}
                      </span>
                      <span className='pollen-value'>{pollen.value}</span>
                    </div>
                  </div>

                  {/* health recommendations */}
                  {pollen.recommendations && pollen.recommendations.length > 0 && (
                    <div className='recommendation-section'>
                      <h4>Health Recommendations:</h4>
                      <div className='recommendation-list'>
                        {pollen.recommendations.map((rec, recIndex) => (
                          <div key={recIndex} className="recommendation">
                            <p className="recommendation-text">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="data-error">
                <p>No pollen data available.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
