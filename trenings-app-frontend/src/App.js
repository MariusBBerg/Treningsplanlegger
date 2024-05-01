// src/App.js
import React, { useEffect,useState } from "react";
import { BrowserRouter, Routes, Route,useLocation } from "react-router-dom";
import HomePage from "./views/HomePage";
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
import PrivacyPolicy from "./views/PrivacyPolicy.js";
import FriendsView from "./views/Socials/FriendsView.js";
import HomeFeed from "./views/HomeFeed.js";
import ChatView from "./views/Socials/ChatView.js";
import PageTransition from './PageTransition'; 
import CircularProgress from "@mui/material/CircularProgress";




function App() {
  const [isLoading, setIsLoading] = useState(true); // Track whether auth check is loading

  useEffect(() => {
    document.title = "Treningsplanleggeren";

    checkAuth()
      .then(() => setIsLoading(false)) // Set loading to false after auth check
      .catch(() => setIsLoading(false)); // Also set to false on error, handle accordingly
  }, []);

  if (isLoading) {
    return <div><CircularProgress  /></div>; // Or any other loading indicator
  }
 

  return (
    <AuthProvider>
      <BrowserRouter>
      <PageTransition>

            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <HomePage />
                  </PublicRoute>
                }
              />

              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginForm />
                  </PublicRoute>
                }
              />

              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterForm />
                  </PublicRoute>
                }
              />

              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomeFeed />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashBoard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/coach"
                element={
                  <ProtectedRoute>
                    <CoachRequestForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <ProtectedRoute>
                    <ClientList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client-dashboard"
                element={
                  <ProtectedRoute>
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/friends"
                element={
                  <ProtectedRoute>
                    <FriendsView />
                  </ProtectedRoute>
                }
              />
              <Route path="/logout" element={<Logout />} />
              <Route
                path="/googlecalendar/callback"
                element={<OAuthCallback />}
              />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatView />
                  </ProtectedRoute>
                }
              />
            </Routes>
      </PageTransition>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
