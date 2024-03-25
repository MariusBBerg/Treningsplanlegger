// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './views/HomePage';
import LoginForm from "./views/LoginForm.js";
import RegisterForm from "./views/RegisterForm.js";
import DashBoard from "./views/DashBoard.js";
import ProtectedRoute from "./auth/ProtectedRoute.js";
import PublicRoute from "./auth/PublicRoute.js";
import Logout from "./components/LogOut.js"; // 
import { AuthProvider } from "./contexts/AuthContext";
import CoachRequestForm from "./views/CoachRequestForm";
import ProfilePage from "./views/ProfilePage.js";
import ClientList from "./views/ClientList.js";
import ClientDashboard from "./views/ClientDashboard.js";
import { Footer } from "flowbite-react";


function App() {
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
