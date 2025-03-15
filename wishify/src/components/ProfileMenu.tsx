import React, { useState, useEffect, useRef } from "react";
import { AiOutlineUser, AiOutlineSetting, AiOutlineLogout, AiFillGift, AiOutlineCloseCircle } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import "./ProfileMenu.css";

interface ProfileMenuProps {
  closeMenu: () => void;
  logOut: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ closeMenu, logOut }) => {
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [showLogOutModal, setShowLogOutModal] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeMenu();
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
    logOut();
    navigate("/landing");
    handleClose();
    setShowLogOutModal(false);
  };

  const cancelLogOut = () => {
    setShowLogOutModal(false);
  };

  return (
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

      <div className="user-info">
        <div className="profile-image">
          <AiOutlineUser className="user-icon" />
        </div>
        <div className="profile-text">
          <p className="user-name">Justin Bijoy</p>
          <p className="user-email">justinbijoy@gmail.com</p>
        </div>
      </div>

      <div className="menu-options">
        <div className="menu-item" onClick={handleAccountSettings}>
          <AiOutlineSetting className="menu-icon" /> Account Settings
        </div>
        <div className="menu-item">Notification Switch</div>
      </div>

      <div className="notification-bar-placeholder">
        <p>Notification Bar (Coming Soon)</p>
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
        sx={{ "& .MuiDialog-paper": { borderRadius: "20px", width: "400px" } }}
      >
        <DialogTitle id="log-out-dialog-title" sx={{ textAlign: "center", fontWeight: "bold" }}>
          Log Out
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="log-out-dialog-description" sx={{ textAlign: "center" }}>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-between", padding: "16px", borderTop: "1px solid #e0e0e0" }}>
          <Button
            onClick={confirmLogOut}
            sx={{
              flex: 1,
              marginRight: "8px",
              border: "1px solid red",
              color: "red",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#ffe6e6" },
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
              "&:hover": { backgroundColor: "#f0f0ff" },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfileMenu;