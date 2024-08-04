import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from './home/home';
import LandingPage from './Components/LandingPage/Landingpage';
import Login from './Components/Login/Login';
import Appointment from "./Appointment/Appointment";
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';
import './App.css';

// New imports
import Topbar from "./scenes/Topbar";
import Sidebar from "./scenes/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Appointments from "./scenes/appointments";
import AdminDoctorsPage from "./scenes/AdminDoctorsPage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import OurTests from "./scenes/ourTests";

function AppContent() {
  const location = useLocation();

  // List of paths where sidebar and topbar should be shown
  const pathsWithSidebarAndTopbar = [
    "/dashboard",
    "/team",
    "/contacts",
    "/invoices",
    "/appointments",
    "/doctors",
    "/ourtests"
  ];

  // Check if the current path is in the list
  const showSidebarAndTopbar = pathsWithSidebarAndTopbar.includes(location.pathname);

  // Existing state hooks
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

  // New state hooks
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <div className="app">
      {/* Conditionally render the sidebar based on the current route */}
      {showSidebarAndTopbar && <Sidebar isSidebar={isSidebar} />}
      <main className="content">
        {showSidebarAndTopbar && <Topbar setIsSidebar={setIsSidebar} />}
        <Routes>
          <Route
            path="/"
            element={
              !showForm ? (
                <LandingPage onSignIn={handleSignIn} onSignUp={handleSignUp} />
              ) : (
                <div className="overlay">
                  <div className="blurred-home">
                    <Home />
                  </div>
                  <div className="form-container">
                    <button className="close-button" onClick={closeForm}>X</button>
                    <Login mode={formMode} />
                  </div>
                </div>
              )
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/appointment"
            element={
              <PrivateRoute>
                <Appointment />
              </PrivateRoute>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctors" element={<AdminDoctorsPage />} />
          <Route path="/ourTests" element={<OurTests />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  // New state hooks
  const [theme, colorMode] = useMode();

  return (
    <AuthProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}

export default App;
