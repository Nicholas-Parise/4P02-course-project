import { useState, useEffect, useRef } from "react";
import { AiOutlineUser, AiOutlineLogout, AiFillGift, AiOutlineCloseCircle, AiOutlineBell, AiFillBell } from "react-icons/ai";
import { FaCrown } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import "./HelpMenu.css";
import HelpAccordion from "./HelpAccordion.jsx";
import React from "react";

interface Props {
  closeMenu: () => void,
  logOut: () => void,
  profile:{
    displayName: string,
    email: string
  };
}

const HelpMenu = ({ closeMenu, logOut, profile }: Props) => {
  const [isClosing, setIsClosing] = useState(false);
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeMenu();
    }, 250);
  };

  const handleAccountSettings = () => {
    navigate("/profile");
    handleClose();
  };

  const handleUpgrade = () => {
    navigate("/upgrade");
    handleClose();
  };

  const confirmLogOut = () => {
    logOut(); 
    navigate("/landing");
    handleClose();
    setShowLogOutModal(false);
  };

  const cancelLogOut = () => {
    setShowLogOutModal(false);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <>
      {!isClosing && <div className="backdrop" onClick={handleClose} />}

      <div className={`help-menu ${isClosing ? "slide-out" : ""}`} ref={menuRef}>
        <div className="header">
          <NavLink to="/home" onClick={handleClose}>
            <h1>
              <span>
                <AiFillGift />
                Wish
              </span>
              ify
            </h1>
          </NavLink>
          <button className="close-btn" onClick={handleClose}>
            <AiOutlineCloseCircle />
          </button>
        </div>
        <div className="help-text-container-outter">
                  <div ref={menuRef} className="help-text-container">
                    <HelpAccordion  title="Creating Wishlists">
                      <p className="help-topic-text">
                        You can create a wishlist by pressing the "Create a Wishlist" button from your home page.
                        Alternativly, you can navigate to your wishlists page by clicking on the "Wishlist" button
                        at the top of your webpage.
                      </p>
                    </HelpAccordion>
                    <HelpAccordion title="Adding to Wishlists">
                      <p className="help-topic-text">
                        To add an item to one of your wishlists, select the "Add Wish" button in the top right corner of your webpage.
                      </p>
                    </HelpAccordion>
                    <HelpAccordion title="Viewing a Wishlist">
                      <p className="help-topic-text">
                        You can view a wishlist simply by clicking on its icon under the "Wishlists" section on the home page.
                        For an indepth view of all of your wishlists, you can click on the "Wishlist" button at the top of your
                        screen to navigate to your wishlists page.
                      </p>
                    </HelpAccordion>
                    <HelpAccordion title="Creating Events">
                      <p className="help-topic-text">
                        You can create an event by pressing the "Create an Event" button from your home page.
                        Alternativly, you can navigate to your events page by clicking on the "Event" button
                        at the top of your webpage.
                      </p>
                    </HelpAccordion>
                    <HelpAccordion title="Editing my Profile">
                      <p className="help-topic-text">
                        You can edit your profile by clicking on the silhouette icon in the top right corner of your webpage,
                        followed by clicking on your account name.
                      </p>
                    </HelpAccordion>
                  </div>
                </div>
      </div>
    </>
  );
};

export default HelpMenu;