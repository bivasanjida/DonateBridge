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
import MyRequests from "./pages/MyRequests.jsx";
import ItemDetail from "./pages/ItemDetail.jsx";
import CreateItem from "./pages/CreateItem.jsx";
import EditItem from "./pages/EditItem.jsx";
import MyItems from "./pages/MyItems.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminVerification from "./pages/AdminVerification.jsx";
import DonationHistory from "./pages/DonationHistory.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <div style={{ marginTop: "70px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="browse" element={<BrowseItems />} />
            <Route path="items/:id" element={<ItemDetail />} />
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
              path="admin"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-requests"
              element={
                <ProtectedRoute requiredRole="NGO">
                  <MyRequests />
                </ProtectedRoute>
              }
            />
            <Route path="create-item" element={<ProtectedRoute requiredRole="Donor"><CreateItem /></ProtectedRoute>} />
            <Route path="edit-item/:id" element={<ProtectedRoute requiredRole="Donor"><EditItem /></ProtectedRoute>} />
            <Route path="my-items" element={<ProtectedRoute requiredRole="Donor"><MyItems /></ProtectedRoute>} />
              path="admin/verification"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/history"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <DonationHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/users"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
