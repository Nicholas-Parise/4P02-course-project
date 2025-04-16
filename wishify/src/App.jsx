import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes"
import { Toaster } from 'sonner';

import './App.css'

import HomePage from "./pages/Home";
import NoPage from "./pages/NoPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OauthSuccess from "./pages/auth/OauthSuccess";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
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
import UpgradePage from "./pages/UpgradePage";
import UpgradeRedirect from "./components/UpgradeRedirect"; // Add this import

import ManageSubscription from './pages/ManageSubscription';
import Success from './pages/Success';
import Cancel from './pages/Cancel';

import About from "./pages/About";
import Privacy from "./pages/Privacy";
import TOS from "./pages/TOS";

import Navbar from "./components/Navbar";

import Footer from "./components/Footer";

import isLoggedInCheck from "./utils/isLoggedIn";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInCheck())

  return (
    <>
      <Toaster richColors position="bottom-left" closeButton />
      <BrowserRouter>

        <div className="relative min-h-screen">
          <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} page={window.location.pathname}/>
          <div className="pb-[253px] sm:pb-[208px]"> {/* Tweaked to stop some overlap on mobile */}
            <Routes>
                <Route index element={<Index />} />
                <Route path="landing" element={<Landing />} />
                <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="oauth-success" element={<OauthSuccess setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="forgot" element={<ResetPassword />} />
                <Route path="status" element={<Status />} />
                <Route path="profile/:userId" element={<PublicProfile />} />
                <Route path="wishlists/share/:share_token" element={<Share isLoggedIn={isLoggedIn} />} />

                <Route path="privacy-policy" element={<Privacy />} />
                <Route path="terms-of-service" element={<TOS />} />
                <Route path="about" element={<About />} />
                <Route path="upgrade-redirect" element={<UpgradeRedirect isLoggedIn={isLoggedIn} />} />
                
                <Route path="/manage-subscription" element={<ManageSubscription />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />

                <Route element={<ProtectedRoutes />}>
                  <Route path="home" element={<HomePage />} />
                  <Route path="events" element={<Events />} />
                  <Route path="events/:id" element={<Event/>}/>
      
                  <Route path="wishlists" element={<Wishlists />} />
                  <Route path="wishlists/:id" element={<Wishlist />} />
                     <Route path="upgrade" element={<UpgradePage/>} />
                  <Route path="ideas" element={<Ideas />} />

                  <Route path="profile" element={<Profile />} />
                  
                </Route>
                <Route path="*" element={<NoPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </>
    );
}

export default App
