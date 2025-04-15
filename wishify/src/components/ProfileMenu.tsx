import { useState, useEffect, useRef } from "react";
import { AiOutlineLogout, AiFillGift, AiOutlineCloseCircle, AiOutlineBell, AiFillBell } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton } from "@mui/material";
import "./ProfileMenu.css";
import { Notification, User } from "../types/types";
import NotificationEntry from "./NotificationEntry";

interface Props {
  closeMenu: () => void,
  logOut: () => void,
  profile: User,
  token: string,
  notifications: Notification[],
  deleteNotification: (id: number) => void
}

const ProfileMenu = ({ closeMenu, logOut, profile, token, notifications, deleteNotification }: Props) => {
  const [isClosing, setIsClosing] = useState(false);
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(profile.notifications);
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

  const handleManage = () => {
    navigate("/manage-subscription");
    handleClose();
  };

  const handleRedirect = (url: string) => {
    navigate(url);
    handleClose();
  }

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
    let status_code = -1
    let url = `https://api.wishify.ca/users`
    // update blind status
    fetch(url, {
        method: 'put',
        headers: new Headers({
            'Authorization': "Bearer "+token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            "notifications": !notificationsEnabled,
        })
    })
    .then((response) => {
        status_code = response.status
        return response.json();
    })
    .then(() => {
        if(status_code != 200 && status_code != 201){
          return
        }
        setNotificationsEnabled(!notificationsEnabled);
    })
    .catch((error) => {
        console.log(error)
    })
  };

  return (
    <>
      {!isClosing && <div className="backdrop" onClick={handleClose} />}

      <div className={`profile-menu ${isClosing ? "slide-out" : ""}`} ref={menuRef}>
        <div className="header">
          <IconButton 
            sx={{":hover":{color:'#5651e5'}, position:"absolute", left: 0, color:"#444"}} onClick={toggleNotifications}
          >
            { notificationsEnabled ? (
              <AiFillBell className='transition-[1]'/>
            )
            :
            (
              <AiOutlineBell className='transition-[1]'/>
            )
            }
                    
          </IconButton>

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
          <img 
              src={profile.picture} 
              className={`w-[75px] h-[75px] overflow-hidden rounded-full ${profile.pro && "ring-[#5651e5] ring-3 "}`}
            />
          </div>
          <div className="profile-text">

            <p className="user-name">{profile.displayname} &nbsp; { profile.pro ? (
            <span className="pro-badge">PRO</span>
            ):( <span></span>)}</p>
            
            <p className="user-email">{profile.email}</p>
          </div>
        </div>

        { !profile.pro ? (
          <div className="upgrade-pro cursor-pointer" onClick={handleUpgrade}>
            <FaStar className="star-icon" />
            <div>
              <p className="upgrade-title">Upgrade to Pro</p>
              <p className="upgrade-subtitle">Unlock premium features</p>
            </div>
          </div>
        ):( 
          <div className="upgrade-pro cursor-pointer" onClick={handleManage}>
            <FaStar className="star-icon" />
            <div>
              <p className="upgrade-title">Manage subscription</p>
              <p className="upgrade-subtitle">Manage premium features</p>
            </div>

          </div>
        )
        }
        
        <div className={`notifications-container-outer ${notifications.length === 0 ? 'flex justify-center items-center' : ''}`}>
          <div className="notifications-container">
            {notifications.length == 0 ?  <p>Your notifications will appear here.</p> :
              <>
                {notifications.map(notification => (
                  <NotificationEntry
                    key={notification.id} 
                    notification={notification}
                    handleRedirect={handleRedirect}
                    deleteNotification={deleteNotification}
                  />
                ))}
              </>
            }
            
          </div>
        </div>

        <div className="horizontal-buttons-container">
          <NavLink 
            to="/privacy-policy" 
            className="horizontal-button" 
            onClick={handleClose}
          >
            Privacy Policy
          </NavLink>
          <NavLink 
            to="/terms-of-service" 
            className="horizontal-button" 
            onClick={handleClose}
          >
            Terms of Service
          </NavLink>
          <NavLink 
            to="/about" 
            className="horizontal-button" 
            onClick={handleClose}
          >
            About
          </NavLink>
        </div>

        <div className="menu-options-bottom">
          <button className="menu-item logout" onClick={() => setShowLogOutModal(true)}>
            <AiOutlineLogout className="menu-icon" /> Log Out
          </button>
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