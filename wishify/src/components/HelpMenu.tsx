import { useState, useEffect, useRef } from "react";
import { AiOutlineUser, AiOutlineLogout, AiFillGift, AiOutlineCloseCircle, AiOutlineBell, AiFillBell } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import "./HelpMenu.css";
import HelpAccordion from "./HelpAccordion.jsx";
import { Card, CardContent, CardHeader, CircularProgress } from "@mui/material"
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import { FaChevronDown } from "react-icons/fa"
import React from "react";

interface Props {
  closeMenu: () => void,
}

const HelpMenu = ({ closeMenu }: Props) => {
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeMenu();
    }, 250);
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
            <p className="help-title">Help Menu</p>
            <Accordion>
              <AccordionSummary expandIcon={<FaChevronDown />}>
                <p className="help-topic-summary">Home</p>
              </AccordionSummary>
              <AccordionDetails>
                <p className="help-topic-text">Your Home page holds a summary of all your account activities, from your most recently made wishlists and events to any contributions you have made.</p>
                <Accordion>
                  <AccordionSummary expandIcon={<FaChevronDown />}>
                    <p className="help-topic-summary">Wishlists</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p className="help-topic-text">The Wishlists section of this page contains a summary of the Wishlists you have made. Your most recently created three can be viewed here, and you can quickly jump to any one of them with a simple click. You can click the “View my Wishlists” button to jump to the Wishlist page to see all Wishlists made and those that are shared to you.</p>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<FaChevronDown />}>
                    <p className="help-topic-summary">Events</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p className="help-topic-text">The Events section of this page contains a summary of the Events you have made. Your most recently created three can be viewed here, and you can quickly jump to any one of them with a simple click. You can click the “View my Events” button to jump to the Events page to see all Events made and those that are shared to you.</p>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<FaChevronDown />}>
                    <p className="help-topic-summary">Contributions</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p className="help-topic-text">The Contributions section holds a list of any changes you have made to your wishlists. It can tell you what item you contributed to, the quantity, purchase status, and any notes you left.</p>
                  </AccordionDetails>
                </Accordion>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<FaChevronDown />}>
                <p className="help-topic-summary">Wishlist</p>
              </AccordionSummary>
              <AccordionDetails>
                <p className="help-topic-text">Your Wishlist page is a collection of all your Wishlists and those that have been shared with you. Here you can create, edit, share, duplicate, and delete your Wishlists.</p>
                <Accordion>
                  <AccordionSummary expandIcon={<FaChevronDown />}>
                    <p className="help-topic-summary">Creation</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p className="help-topic-text">You can create a Wishlist simply by clicking the “Create a Wishlist” button under the “My Wishlists” section. Now give it a name, description, due date, and a preset image. With that, your Wishlist has been made!</p>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<FaChevronDown />}>
                    <p className="help-topic-summary">Add a Wish</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p className="help-topic-text">To add an item to one of your Wishlists, click on the “Add Wish” button at the top. While there are many fields to fill out, only the Wishlist, Name, Price, and Quantity fields are required to add an item. Other options such as a Link, Image, or Description are up to you!</p>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<FaChevronDown />}>
                    <p className="help-topic-summary">Removing a Wish</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p className="help-topic-text">To remove an item from a Wishlist, first open the Wishlist with the item to be removed. Then, click on the trash can icon next to the item you would like to remove. After confirming this was done on purpose, it will be gone from the Wishlist.</p>
                  </AccordionDetails>
                </Accordion>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<FaChevronDown />}>
                <p className="help-topic-summary">Event</p>
              </AccordionSummary>
              <AccordionDetails>
                <p className="help-topic-text">An Event is a collection of Wishlists that you can share with people. Your Event page stores all Events you have created as well as those that are shared to you. You can create, edit, share, and delete Events from here.</p>
                <Accordion>
                  <AccordionSummary expandIcon={<FaChevronDown />}>
                    <p className="help-topic-summary">Creation</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p className="help-topic-text">Click on the “Create an Event” button, put in a title, and you're all done. You can edit the Events details, such as the date or address of the event, from inside the Event itself.</p>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<FaChevronDown />}>
                    <p className="help-topic-summary">Adding a Wishlist</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p className="help-topic-text">To add a Wishlist to an Event, click into that event, and select the “Add a Wishlist” button.</p>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<FaChevronDown />}>
                    <p className="help-topic-summary">Removing a Wishlist</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p className="help-topic-text">To remove a particular Wishlist from an Event, first click into the Event. Now from the list of Wishlists attached to this Event, find the Wishlist to remove, click edit, and select the “REMOVE FROM EVENT” option.</p>
                  </AccordionDetails>
                </Accordion>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<FaChevronDown />}>
                <p className="help-topic-summary">Ideas</p>
              </AccordionSummary>
              <AccordionDetails>
                <p className="help-topic-text">Wishify's Ideas page is here to give you Wish suggestions, based on your likes and dislikes selected in your profile.</p>
                <p className="help-topic-text">This page offers a trending section, listing all the recently most Wished items. Our AI Recommendations sections boasts a collection of Wish ideas, based around any likes and dislikes you have, as well as a selection of different items to browse.</p>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpMenu;