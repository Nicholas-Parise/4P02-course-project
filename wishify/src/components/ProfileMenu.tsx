import { useState, useEffect, useRef } from "react";
import { AiOutlineUser, AiOutlineLogout, AiFillGift, AiOutlineCloseCircle, AiOutlineBell, AiFillBell } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import "./ProfileMenu.css";
import React from "react";

interface Props {
  closeMenu: () => void,
  logOut: () => void,
  profile:{
    displayName: string,
    email: string
  };
}

const ProfileMenu = ({ closeMenu, logOut, profile }: Props) => {
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

<<<<<<< HEAD
=======
  /*useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu]);*/

>>>>>>> origin/main

  const handleAccountSettings = () => {
    navigate("/profile");
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

      <div className={`profile-menu ${isClosing ? "slide-out" : ""}`} ref={menuRef}>
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

        <div className="user-info cursor-pointer" onClick={handleAccountSettings}>
          <div className="profile-image">
            <AiOutlineUser className="user-icon" />
          </div>
          <div className="profile-text">
            <p className="user-name">{profile.displayName}</p>
            <p className="user-email">{profile.email}</p>
          </div>
        </div>

        <div className="notification-toggle-container cursor-pointer" onClick={toggleNotifications}>
          <div className="notification-toggle">
            {notificationsEnabled ? (
              <AiFillBell className="bell-icon" />
            ) : (
              <AiOutlineBell className="bell-icon" />
            )}
            <span>{notificationsEnabled ? "Notifications Enabled" : "Notifications Disabled"}</span>
          </div>
        </div>
        
        <div className="notifications-placeholder">
          <p>Your notifications will appear here.</p>
        </div>

        <div className="menu-options-bottom">
          <div className="menu-item logout" onClick={() => setShowLogOutModal(true)}>
            <AiOutlineLogout className="menu-icon" /> Log Out
          </div>
        </div>

        <Dialog
          open={showLogOutModal}
          onClose={cancelLogOut}
          aria-labelledby="log-out-dialog-title"
          aria-describedby="log-out-dialog-description"
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "16px", 
              width: "400px", 
            },
          }}
        >
          <DialogTitle id="log-out-dialog-title" sx={{ textAlign: "center", fontWeight: "bold" }}>
            Log Out
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="log-out-dialog-description" sx={{ textAlign: "center" }}>
              Are you sure you want to log out?
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Button
              onClick={confirmLogOut}
              sx={{
                flex: 1,
                marginRight: "8px",
                border: "1px solid red",
                color: "red",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#ffe6e6",
                },
              }}
            >
              Log Out
            </Button>
            <Button
              onClick={cancelLogOut}
              sx={{
                flex: 1,
                marginLeft: "8px",
                border: "1px solid #5651e5",
                color: "#5651e5",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#f0f0ff",
                },
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default ProfileMenu;