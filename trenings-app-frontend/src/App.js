// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage';
import LoginForm from "./components/LoginForm.js";
import RegisterForm from "./components/RegisterForm.js";
import DashBoard from "./components/DashBoard.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import PublicRoute from "./components/PublicRoute.js";
import Logout from "./components/LogOut.js"; // Importer Logout-komponenten
import { AuthProvider } from "./contexts/AuthContext";
import CoachRequestForm from "./components/CoachRequestForm";

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
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
