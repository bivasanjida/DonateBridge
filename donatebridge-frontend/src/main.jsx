import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import "./App.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import NavBar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import BrowseItems from "./pages/BrowseItems.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import NgoDashboard from "./pages/NgoDashboard.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <div style={{ marginTop: "70px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="browse"
              element={
                <ProtectedRoute>
                  <BrowseItems />
                </ProtectedRoute>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="ngo-dashboard"
              element={
                <ProtectedRoute requiredRole="NGO">
                  <NgoDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
