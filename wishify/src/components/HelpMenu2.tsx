import { useState, useEffect, useRef } from "react";
import { AiOutlineUser, AiFillGift, AiOutlineCloseCircle, AiOutlineBell, AiFillBell } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import "./HelpMenu.css";
import HelpAccordion from "./HelpAccordion.jsx";

var hello = 'something'

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

  const handleClose2 = () => {
    hello = 'hello world'
    setIsClosing(true);
    setTimeout(() => {
      //closeMenu();
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
     /* if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        console.log(hello)
        console.log(event.target)
        console.log(menuRef)
        hello = 'something'
        handleClose();
        */
        const target = event.target as HTMLElement;
        console.log(event.target)
        
        if (menuRef.current && target.classList.contains("backdrop")) {
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

        <div className="help-text-container-outter" onClick={handleClose2}>
          <div ref={menuRef} className="help-text-container" onClick={handleClose2}>
            <HelpAccordion  title="Creating Wishlists" onClick={handleClose2}>
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