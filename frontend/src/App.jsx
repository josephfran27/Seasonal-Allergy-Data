import { useState } from 'react'
import { GiLindenLeaf } from "react-icons/gi";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GiLindenLeaf />
      <h1>Welcome to Joe's Allergy Data because his allergies suck!</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className="little-green-text">
        Hopefully you can learn something from this!
      </p>
    </>
  )
}

export default App
