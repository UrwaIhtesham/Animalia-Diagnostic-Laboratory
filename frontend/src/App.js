import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Home from './home/home';
import LandingPage from './Components/LandingPage/Landingpage';
import Login from './Components/Login/Login';
import Appointment from "./Appointment/Appointment";
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('login');

  const handleSignIn = () => {
    setFormMode('login');
    setShowForm(true);
  };

  const handleSignUp = () => {
    setFormMode('signup');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={!showForm ? <LandingPage onSignIn={handleSignIn} onSignUp={handleSignUp} /> : (
            <div className="overlay">
              <div className="blurred-home">
                <Home />
              </div>
              <div className="form-container">
                <button className="close-button" onClick={closeForm}>X</button>
                <Login mode={formMode} />
              </div>
            </div>
          )} />
          <Route path="/home" element={<Home />} />
          <Route path= "/appointment" element={<Appointment />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
