import { useState, useEffect, useRef } from "react";
import { AiOutlineUser, AiFillGift, AiOutlineCloseCircle, AiOutlineBell, AiFillBell } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import "./HelpMenu.css";

interface Props {
  closeMenu: () => void;
}

const HelpMenu = ({ closeMenu }: Props) => {
  const [isClosing, setIsClosing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
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

        <div className="help-header">
          <div className="header-container">
            <p className="header-text">Website Help</p>
            
          </div>
        </div>

        <div className="help-text-container-outter">
          <div className="help-text-container">
            <p className="help-topic-header">Creating Wishlists</p>
            <p className="help-topic-text">
              You can create a wishlist by pressing the "Create a Wishlist" button from your home page.
              Alternativly, you can navigate to your wishlists page by clicking on the "Wishlist" button
              at the top of your webpage.
            </p>

            <br/>
            <p className="help-topic-header">Adding to Wishlists</p>
            <p className="help-topic-text">
              To add an item to one of your wishlists, select the "Add Wish" button in the top right corner of your webpage.
            </p>

            <br/>
            <p className="help-topic-header">Viewing a Wishlist</p>
            <p className="help-topic-text">
              You can view a wishlist simply by clicking on its icon under the "Wishlists" section on the home page.
              For an indepth view of all of your wishlists, you can click on the "Wishlist" button at the top of your
              screen to navigate to your wishlists page.
            </p>

            <br/>
            <p className="help-topic-header">Creating Events</p>
            <p className="help-topic-text">
              You can create an event by pressing the "Create an Event" button from your home page.
              Alternativly, you can navigate to your events page by clicking on the "Event" button
              at the top of your webpage.
            </p>

            <br/>
            <p className="help-topic-header">Editing my Profile</p>
            <p className="help-topic-text">
              You can edit your profile by clicking on the silhouette icon in the top right corner of your webpage,
              followed by clicking on your account name.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpMenu;