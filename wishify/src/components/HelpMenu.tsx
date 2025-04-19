import { useState, useEffect, useRef } from "react";
import { AiFillGift, AiOutlineCloseCircle } from "react-icons/ai";
import { NavLink, useLocation } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { FaChevronDown } from "react-icons/fa";
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
          content: "Create wishlists for different occasions or purposes. Each wishlist can have a title, detailed description, cover image, and optional due date. Use the drag-and-drop feature to reorder items based on your priority."
        },
        {
          title: "Adding and Managing Items",
          content: "Add items with comprehensive details including image, purchase links, and quantity needed."
        },
        {
          title: "Advanced Sharing Options",
          content: "Share wishlists via unique links or direct email invitations. Control permissions at two levels: Contributor (can reserve items), and Owner (can modify the wishlist)."
        },
        {
          title: "Collaboration Features",
          content: "Enable comments on your wishlist item to get feedback from friends. The item comment log shows all changes made by collaborators."
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
          title: "Managing Participant Wishlists",
          content: "Add existing wishlists from your collection or invite others to contribute theirs. Set visibility preferences for each wishlist. The unified view shows all items across wishlists, with filters to narrow down options."
        },
        {
          title: "RSVP and Gift Tracking",
          content: "Invite participants to the event. Track their responses and see who has reserved or purchased gifts."
        },
        {
          title: "Event Analytics",
          content: "Track RSVPs and gift progress through the event dashboard. See which items have been reserved or purchased. Generate thank-you lists to acknowledge contributors. Pro users get detailed analytics on participation rates and gift trends."
        },
        {
          title: "Post-Event Features",
          content: "After the event, convert it to 'Archived' status to preserve all information. Send thank-you messages to participants directly through Wishify. Export a complete gift report for your records. Reactivate archived events for recurring occasions."
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
          content: "Our Algorithm analyzes your past wishlists, and preferences to suggest perfect gift ideas."
        },
        {
          title: "Idea to Wishlists",
          content: "With one click, add discovered items directly to any of your wishlists. The system automatically populates available details like images and descriptions."
        }
      ]
    },
    general: {
      title: "General Help & Support",
      sections: [
        {
          title: "Dashboard Overview",
          content: "Your Home dashboard provides a comprehensive snapshot of your Wishify activity. The top section shows your most recently accessed wishlists and events, while the bottom section displays your recent contributions to others' wishlists. Each card shows key information at a glance, including item counts, upcoming dates, and contribution statuses."
        },
        {
          title: "Quick Navigation",
          content: "Click any wishlist or event card to jump directly to it. The 'View All' buttons take you to complete lists of your wishlists or events. Use the quick action buttons (+ Add Wish) to create new items without leaving the home page. The Navigation bar provides instant access to all major sections of the application."
        },
        {
          title: "Activity Tracking",
          content: "The Contributions section meticulously tracks all items you've pledged to purchase from shared wishlists. Each entry shows the item name, purchase status (reserved/purchased), quantity, price, and any notes you've added. Click on any contribution to see more details about the wishlist and the item within the wishlist."
        },
        {
          title: "Account Management",
          content: "Update your profile picture, display name, and personal details in Account Settings. Configure notification preferences for wishlist or events within the specific wishlist and events. The master switch for notication is within the sidebar when you click your profile icon in the Navigation bar."
        },
        {
          title: "Navigation Tips",
          content: "Use the persistent Navigation bar to quickly switch between app sections."
        },
        {
          title: "Troubleshooting Common Issues",
          content: "If links aren't working, check your browser's pop-up settings. For syncing problems, try refreshing the page or logging out and back in. Clear your browser cache if you see outdated information. Image upload issues can often be resolved by checking file size and format requirements."
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
                  <strong>Priority Support</strong> - 24-hour response guarantee and live chat
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
          content: "Our 24/7 support team can be reached at support@wishify.com or through the in-app chat (bottom right corner). Include screenshots for technical issues. For feature requests, visit our feedback portal at feedback.wishify.com. Check our YouTube channel for video tutorials on advanced features."
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