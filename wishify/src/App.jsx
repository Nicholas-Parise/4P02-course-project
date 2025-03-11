import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes"

import './App.css'

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
import Index from "./pages/Index";

import Navbar from "./components/Navbar";

function App() {

  const [navBarRefresh, setNavbarRefresh] = useState(0)

  const forceNavbarRefresh = () => {
    setNavbarRefresh(navBarRefresh + 1)
  }

  return (
    <>
      <BrowserRouter>
        <Navbar refresh={navBarRefresh} />
        <Routes>
            <Route index element={<Index />} />
            <Route path="landing" element={<Landing />} />
            <Route path="login" element={<Login forceNavbarRefresh={forceNavbarRefresh} />} />
            <Route path="register" element={<Register />} />

            <Route element={<ProtectedRoutes />}>
              <Route path="home" element={<HomePage />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<Event/>}/>
  
              <Route path="wishlists" element={<Wishlists />} />
              <Route path="wishlists/:id" element={<Wishlist />} />

              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
      </>
    );
}

export default App
