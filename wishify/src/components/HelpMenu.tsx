import { useState, useEffect, useRef } from "react";
import { AiFillGift, AiOutlineCloseCircle } from "react-icons/ai";
import { NavLink, useLocation } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { FaChevronDown, FaShare } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlash, faEye, faCrown } from "@fortawesome/free-solid-svg-icons";
import "./HelpMenu.css";

interface Props {
  closeMenu: () => void,
}

const HelpMenu = ({ closeMenu }: Props) => {
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  type HelpSectionKey = keyof typeof helpContent;
  const [activeSection, setActiveSection] = useState<HelpSectionKey | "">("");

  useEffect(() => {
    // Determine which help section to show based on current route
    const path = location.pathname;
    if (path.includes("/wishlists")) {
      setActiveSection("wishlist");
    } else if (path.includes("/events")) {
      setActiveSection("event");
    } else if (path.includes("/ideas")) {
      setActiveSection("ideas");
    } else {
      setActiveSection("");
    }
  }, [location]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeMenu();
    }, 250);
  };

  const helpContent = {
    wishlist: {
      title: "Wishlist Management Help",
      sections: [
        {
          title: "Creating and Organizing Wishlists",
          content: "Simply click the 'create a wishlist' button. You can create wishlists for different occasions or purposes."
        },
        {
          title: "Adding and Managing Items",
          content: "Simply click the 'Add wish' button to add an item. Use the drag-and-drop feature to reorder items based on your priority."
        },
        {
          title: "Sharing",
          content:(
          <>
          Share wishlists via unique links or direct email invitations. Simply click:
          <FaShare style={{ marginLeft:"2px", display:"inline-block", color: "#5651e5" }} className='transition-[1]'/>
          </>
          )
        },
        {
          title: "Permissions",
          content:(
            <>
             permission levels: 
             <br></br>
             <FontAwesomeIcon icon={faCrown} fontSize={12} className="opacity-[54%]"/>
             Owner (can modify the wishlist)
             <br></br>
             <span style={{ display: "inline-block", verticalAlign: "middle", marginRight: 14 }}>
                <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faCrown} fontSize={12} className="opacity-[54%]"/>
                {<FontAwesomeIcon icon={faSlash} fontSize={12} />}
              </span>
              </span>
              <span style={{ display:"inline-block"}}>
              Contributor (can reserve items)
              </span>
             
              <br></br>
             <FontAwesomeIcon icon={faEye} fontSize={12} className="opacity-[54%]"/>
             Viewer (can see contributions)
             <br></br>
             <span style={{ display: "inline-block", verticalAlign: "middle", marginRight: 14 }}>
                <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faEye} fontSize={12} className="opacity-[54%]"/>
                {<FontAwesomeIcon icon={faSlash} fontSize={12} />}
              </span>
              </span>
              <span style={{ display:"inline-block"}}>
              Blind (cannot see contributions)
              </span>
        
             <span style={{ visibility:"hidden" }}>s p a c e</span>

            </>
          ) 
        },
        {
          title: "Collaboration Features",
          content: "Click the item to leave a contribution, you can mark it as purchased or reserved."
        },
        {
          title: "Wishlist Analytics",
          content: "Track the status of items in your wishlist. See which items have been reserved or purchased, and by whom."
        },
        {
          title: "Wishlist Customization",
          content: "Customize the look and feel of your wishlist with themes and layouts."
        }
      ]
    },
    event: {
      title: "Event Coordination Help",
      sections: [
        {
          title: "Creating and Customizing Events",
          content: "Events bring together multiple wishlists for occasions like birthdays or holidays. Add event details including dates, locations, and custom cover images."
        },
        {
          title: "Managing Wishlists",
          content: "Add existing wishlists from your collection or create a new one. invite others to contribute theirs."
        },
        {
          title: "Member and Gift Tracking",
          content: "Invite participants to the event. Track their responses and see who has reserved or purchased gifts."
        },
        {
          title: "Event Analytics",
          content: "Track Members and gift progress through the event dashboard. See which items have been reserved or purchased."
        },
        {
          title: "Event Sharing",
          content:(
            <>
            Share wishlists via unique links or direct email invitations. Simply click:
            <FaShare style={{ marginLeft:"2px", display:"inline-block", color: "#5651e5" }} className='transition-[1]'/>
            </>
            )
        },
        {
          title: "Event Collaboration",
          content: "The item comment log shows all changes made by collaborators."
        }
      ]
    },
    ideas: {
      title: "Gift Ideas Discovery Help",
      sections: [
        {
          title: "Trending and Popular Items",
          content: "Discover what's currently popular across Wishify's community. See real-time trending data with most-wished and most-purchased items."
        },
        {
          title: "Personalized Recommendations",
          content: "Our Algorithm analyzes your likes and dislikes to suggest perfect gift ideas."
        },
        {
          title: "Idea to Wishlists",
          content: "With one click, add discovered items directly to any of your wishlists!"
        },
        {
          title: "Idea Analytics",
          content: "See the popularity of items you discover. See which items have been the most wishlisted."
        }
      ]
    },
    general: {
      title: "General Help & Support",
      sections: [
        {
          title: "Dashboard Overview",
          content: "Your Home dashboard provides a comprehensive snapshot of your Wishify activity. See your recently accessed wishlists, events and your recent contributions to others' wishlists."
        },
        {
          title: "Quick Navigation",
          content: "Click any wishlist or event card to jump directly to it. The Navigation bar and profile menu provide instant access to all major sections of the application."
        },
        {
          title: "Activity Tracking",
          content: "The Contributions section meticulously tracks all items you've pledged to purchase. Click on any contribution to see more details."
        },
        {
          title: "Account Management",
          content: "Mange your account settings by navigating to your profile and editing the fields."
        },
        {
          title: "Notifications",
          content: "Configure notification preferences for wishlist or events within the specific wishlist and events. The master switch for notication is within the sidebar."
        },
        {
          title: "Troubleshooting Common Issues",
          content: "If links aren't working, check your browser's pop-up settings. For syncing problems, try refreshing the page or logging out and back in. Clear your browser cache if you see outdated information."
        },
        {
          title: "Pro Features Explained",
          content: (
            <div className="pro-features-help">
              <ul>
                <li>
                  <strong>Unlimited Wishlists</strong> - Create as many as you need (vs. 3 in Free)
                </li>
                <li>
                  <strong>Exclusive Pro Badge</strong> - Verified profile marker that increases gifting credibility
                </li>
                <li>
                  <strong>Priority Support</strong> - 24-hour response guarantee
                </li>
                <li>
                  <strong>Early Feature Access</strong> - Try new tools weeks before public release
                </li>
              </ul>
                <button 
                  className="upgrade-button"
                  onClick={() => window.location.href = '/upgrade'}
                >
                  Upgrade to Pro
                </button>
            </div>
          )
        },
        {
          title: "Getting Additional Support",
          content: "Our 24/7 support team can be reached at support@wishify.com. Include screenshots for technical issues."
        }
      ]
    }
  };

  const currentHelp = activeSection && activeSection in helpContent ? helpContent[activeSection] : helpContent.general;

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
              ify Help Center
            </h1>
          </NavLink>
          <button className="close-btn" onClick={handleClose}>
            <AiOutlineCloseCircle />
          </button>
        </div>
        
        <div className="help-context-banner">
          Showing help for: <span>{currentHelp.title}</span>
        </div>

        <div className="help-text-container-outter">
          <div ref={menuRef} className="help-text-container">
            {currentHelp.sections.map((section, index) => (
              <Accordion key={index} defaultExpanded={index === 0}>
                <AccordionSummary expandIcon={<FaChevronDown />}>
                  <p className="help-topic-summary">{section.title}</p>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="help-topic-text">{section.content}</p>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpMenu;