import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Home from './assets/LandingPage/Home.jsx'

import About from './assets/LandingPage/About.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Home />
    
    <About />
    

  </React.StrictMode>,
)
