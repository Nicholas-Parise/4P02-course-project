import React, { useState, useEffect, useRef } from "react";
import { AiOutlineUser, AiOutlineLogout, AiFillGift, AiOutlineCloseCircle, AiOutlineBell, AiFillBell } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import "./ProfileMenu.css";

const ProfileMenu = ({ closeMenu, logOut }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // State for notifications
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeMenu();
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu]);

  const handleAccountSettings = () => {
    navigate("/profile");
    handleClose();
  };

  const confirmLogOut = () => {
    logOut(); // Call the logOut function from AuthContext
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
      {/* Backdrop */}
      {!isClosing && <div className="backdrop" onClick={handleClose} />}

      {/* Profile Menu */}
      <div className={`profile-menu ${isClosing ? "slide-out" : ""}`} ref={menuRef}>
        {/* Close Button and Logo */}
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

        {/* User Info */}
        <div className="user-info">
          <div className="profile-image">
            <AiOutlineUser className="user-icon" />
          </div>
          <div className="profile-text" onClick={handleAccountSettings}>
            <p className="user-name">Justin Bijoy</p>
            <p className="user-email">justinbijoy@gmail.com</p>
          </div>
        </div>

        {/* Notification Toggle at the Top */}
        <div className="notification-toggle-container" onClick={toggleNotifications}>
          <div className="notification-toggle">
            {notificationsEnabled ? (
              <AiFillBell className="bell-icon" />
            ) : (
              <AiOutlineBell className="bell-icon" />
            )}
            <span>{notificationsEnabled ? "Notifications Enabled" : "Notifications Disabled"}</span>
          </div>
        </div>
        
        {/* Notifications Placeholder Container */}
        <div className="notifications-placeholder">
          <p>Your notifications will appear here.</p>
          {/* You can dynamically render notifications here later */}
        </div>

        {/* Log Out Button (Fixed at the Bottom) */}
        <div className="menu-options-bottom">
          <div className="menu-item logout" onClick={() => setShowLogOutModal(true)}>
            <AiOutlineLogout className="menu-icon" /> Log Out
          </div>
        </div>

        {/* Log Out Confirmation Modal */}
        <Dialog
          open={showLogOutModal}
          onClose={cancelLogOut}
          aria-labelledby="log-out-dialog-title"
          aria-describedby="log-out-dialog-description"
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "16px", // Rounded corners
              width: "400px", // Adjust width as needed
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