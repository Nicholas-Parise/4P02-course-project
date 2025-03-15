import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext"; // Import AuthProvider
import ProtectedRoutes from "./components/ProtectedRoutes";
import "./App.css";

// Pages
import HomePage from "./pages/Home";
import NoPage from "./pages/NoPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Events from "./pages/Events";
import Event from "./pages/Event";
import Wishlists from "./pages/Wishlists";
import Landing from "./pages/Landing";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";

// Components
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <BrowserRouter>
        <Navbar /> {/* Navbar will now use AuthContext internally */}
        <Routes>
          <Route index element={<Index />} />
          <Route path="landing" element={<Landing />} />
          <Route path="" element={<Landing />} />
          <Route path="login" element={<Login />} /> {/* Login will update AuthContext */}
          <Route path="register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="home" element={<HomePage />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<Event />} />
            <Route path="wishlists" element={<Wishlists />} />
            <Route path="wishlists/:id" element={<Wishlist />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;