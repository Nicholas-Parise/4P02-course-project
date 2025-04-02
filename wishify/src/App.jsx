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
import PublicProfile from "./pages/PublicProfile";
import Index from "./pages/Index";
import Status from "./pages/Status";
import Share from"./pages/Share";
import Ideas from "./pages/Ideas";

import Navbar from "./components/Navbar";

import isLoggedInCheck from "./utils/isLoggedIn";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInCheck())

  return (
    <>
      <BrowserRouter>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} page={window.location.pathname}/>
        <Routes>
            <Route index element={<Index />} />
            <Route path="landing" element={<Landing />} />
            <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="register" element={<Register />} />
            <Route path="status" element={<Status />} />
            <Route path="profile/:userId" element={<PublicProfile />} />
            <Route path="wishlists/share/:share_token" element={<Share isLoggedIn={isLoggedIn} />} />

            <Route element={<ProtectedRoutes />}>
              <Route path="home" element={<HomePage />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<Event/>}/>
  
              <Route path="wishlists" element={<Wishlists />} />
              <Route path="wishlists/:id" element={<Wishlist />} />

              <Route path="ideas" element={<Ideas />} />

              <Route path="profile" element={<Profile />} />
              
            </Route>
            <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
      </>
    );
}

export default App
