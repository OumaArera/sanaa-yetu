import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'; // Import Routes
import NavBar from './assets/LandingPage/NavBar';
import Login from './assets/LandingPage/Login';
import Register from './assets/LandingPage/Register';
import "./App.css";

function App() {
  return (
    <Router>
      <div id="nav-bar">
        <header className="header">
          <NavLink to={'/'}>
          </NavLink>
          <NavBar />
        </header>
        <Routes> 
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} /> */}
          <Route path="/signin" element={<Login />} /> 
          <Route path="/signup" element={<Register />} /> 
        </Routes>
      </div>
    </Router>
  )
}

export default App;

