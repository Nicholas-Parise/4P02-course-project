import React from "react";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { useState } from 'react'

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
import Navbar from './components/Navbarmain';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route index element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<Event/>}/>
            <Route path="landing" element={<Landing />} />
            <Route path="wishlists" element={<Wishlists />} />
            <Route path="wishlists/:id" element={<Wishlist />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<NoPage />} />
            <Route path="/" element={<Navigate replace to="/home" />} />
        </Routes>
      </BrowserRouter>
      </>
    );
}

export default App
