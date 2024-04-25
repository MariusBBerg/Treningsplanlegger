// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './views/HomePage';
import LoginForm from "./views/Authentication/LoginForm.js";
import RegisterForm from "./views/Authentication/RegisterForm.js";
import DashBoard from "./views/DashBoard.js";
import ProtectedRoute from "./auth/ProtectedRoute.js";
import PublicRoute from "./auth/PublicRoute.js";
import Logout from "./components/LogOut.js";  
import { AuthProvider } from "./contexts/AuthContext";
import CoachRequestForm from "./views/CoachRequestForm";
import ProfilePage from "./views/ProfilePage.js";
import ClientList from "./views/ClientList.js";
import ClientDashboard from "./views/ClientDashboard.js";
import checkAuth from "./views/Hooks/checkAuth.js";
import OAuthCallback from "./components/Workout/Hooks/OAuthCallback.js";


function App() {
  useEffect(() => {
    document.title = "Treningsplanleggeren";
    

    checkAuth(); // Sjekk tokenet ved første lasting
  }, []);

 
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
            } />


          <Route path="/register" element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
            } />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          />

          <Route path="/coach" element={<ProtectedRoute><CoachRequestForm /></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute><ClientList /></ProtectedRoute>} />
          <Route path="/client-dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />

          <Route path="/profile" element={<ProtectedRoute><ProfilePage  /></ProtectedRoute>} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/googlecalendar/callback" element={<OAuthCallback />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
