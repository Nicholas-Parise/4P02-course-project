import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { AiFillGift, AiOutlinePlus, AiOutlineUser, AiFillQuestionCircle, AiOutlineMenu, AiOutlineClose, AiFillBell } from 'react-icons/ai';
import { User, Wishlist, Notification, WishlistItem } from '../types/types';
import CreateItemDialog from './CreateItemDialog';
import ProfileMenu from './ProfileMenu';
import HelpMenu from './HelpMenu';
import '../components/landingheader.css';
import { toast } from "sonner"
import { IconButton } from '@mui/material';

const Navbar = ({ isLoggedIn, setIsLoggedIn }: { isLoggedIn: boolean, setIsLoggedIn: (val: boolean)=>void, page: string }) => {
  interface NavItem {
    label: string;
    href: string;
  }

  const [listNav] = useState<NavItem[]>([
    { label: 'Wishlist', href: '/wishlists' },
    { label: 'Events', href: '/events' },
    { label: 'Ideas', href: '/ideas' },
  ]);

  const [token, setToken] = useState<string>(localStorage.getItem('token') || '')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState<Partial<WishlistItem>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 900);
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [openedNotificationAlert, setOpenedNotificationAlert] = useState<boolean>(false)

  useEffect(() => {
    if (!isLoggedIn){
      toast.dismiss()
      setOpenedNotificationAlert(false)
      return
    } 

    setNotifications([])
    const token = localStorage.getItem('token') || ''
    console.log(token)
    setToken(token)

    const getNotifications = () => {
      console.log(token)
      let status_code = -1
      const notificationsURL = `https://api.wishify.ca/notifications`
      fetch(notificationsURL, {
        method: 'get',
        headers: new Headers({
          'Authorization': "Bearer "+token
        })
      })
      .then((response) => {
        status_code = response.status
        return response.json();
      })
      .then((data) => {
        if(status_code == 404) return
        console.log(data)
        setNotifications(data);
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => console.log(token))
    }
    getNotifications()

    const interval = setInterval(() => {
      getNotifications()
    },25*1000); // 25 second notification refresh
    return () => clearInterval(interval);
  }, [isLoggedIn])

  const deleteNotification = (id: number) => {
    // send delete request
    fetch(`https://api.wishify.ca/notifications/${id}`, {
      method: 'delete',
      headers: new Headers({
        'Authorization': "Bearer "+token
      })
      })
      .then((response) => {
        return response.json();
      })
      .then(() => {
        // remove from array
        const newNotifications = notifications.filter(notif => notif.id !== id)
        setNotifications(newNotifications)
      })
      .catch((error) => {
        console.log("Failed to delete notification\n" + error)
      })
  }

  useEffect(() => {
    if(openedNotificationAlert || !profile?.notifications) return // existing alert

    const readNotifications = () => {
      notifications.filter(n => !n.is_read).forEach(n => {
        fetch(`https://api.wishify.ca/notifications/${n.id}`, {
          method: 'put',
          headers: new Headers({
            'Authorization': "Bearer "+token,
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            "is_read": true,
          })
          })
          .catch((error) => {
            console.log("Failed to set notification as read\n" + error)
          })
      })
    }

    const newNotifications = notifications.filter(n => !n.is_read)
    let num = newNotifications.length

    if(num == 0 || openedNotificationAlert) return // no new notifications or the alert is already opened

    setOpenedNotificationAlert(true)
    toast.custom(t => (
      <div className='notification-toast' onClick={() => (setIsProfileMenuOpen(true), setOpenedNotificationAlert(false), readNotifications(), toast.dismiss(t))}>
        <AiFillBell className='mr-1 text-[#5651e5]' size={28} />
        {num == 1 ? "You have a new notification!" : "You have new notifications!"}
        <IconButton sx={{marginLeft: 2}} onClick={(e) => (e.stopPropagation(), setOpenedNotificationAlert(false), readNotifications(), toast.dismiss(t))}>
          <AiOutlineClose size={18} />
        </IconButton>
      </div>
    ),{
      onDismiss: () => {
        setOpenedNotificationAlert(false)
        readNotifications()
      },
      onAutoClose: () => {
        setOpenedNotificationAlert(false)
        readNotifications()
      },
      duration: Number.POSITIVE_INFINITY,
    })
    
  }, [notifications])

  const fetchWishlists = () => {
    setLoading(true);

    const url = "https://api.wishify.ca/wishlists";

    fetch(url, {
      method: 'get',
      headers: new Headers({
        'Authorization': "Bearer " + token
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setWishlists(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      })
      .finally(() => setLoading(false));

    return { wishlists, loading, error };
  };

  const [profile, setProfile] = useState<User>();

  useEffect(() => {
    if(token === '') return

    fetch("https://api.wishify.ca/users/", {
        method: 'get',
        headers: new Headers({
          'Authorization': "Bearer "+token
        })
      })
        .then((response) => response.json())
        .then((data) => {
          setProfile(data.user)
          console.log(data)
        })
        .catch((error) => {
          console.log(error)
        })
  }, [token, isLoggedIn]);

  

  const openModal = () => {
    setNewItem({});
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > 900;
      setIsDesktop(desktop);
      if (desktop) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <>
          <nav className='navbar'>
            <div className='container1'>
              <NavLink to="/" className='logo' onClick={closeMobileMenu}>
                <h1><span><AiFillGift />Wish</span>ify</h1>
              </NavLink>

              {/* Mobile menu button and persistent icons */}
              <div className="mobile-header-icons">
                <AiFillQuestionCircle className="text-2xl cursor-pointer" onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)} />
                  
                {isHelpMenuOpen && <HelpMenu closeMenu={() => setIsHelpMenuOpen(false)} />}
                
                {profile ? (
                  <img 
                    src={profile.picture} 
                    className={`w-8 h-8 rounded-full cursor-pointer object-cover ${profile.pro ? "ring-2 ring-[#5651e5]" : ""}`}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    alt="Profile"
                  />
                ) : (
                  <AiOutlineUser 
                    className="text-2xl cursor-pointer" 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                  />
                )}
                {profile && isProfileMenuOpen && <ProfileMenu 
                      logOut={() => {setIsLoggedIn(false); localStorage.removeItem("token"); setToken('')}}
                      closeMenu={() => setIsProfileMenuOpen(false)} 
                      profile={profile}
                      token={token}
                      notifications={notifications}
                      deleteNotification={deleteNotification}
                      />}

                <div className='mobile-menu-button' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </div>
              </div>

              <div className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                {listNav.map((item, index) => (
                  <NavLink key={index} to={item.href} className='nav-link' onClick={closeMobileMenu}>
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {/* Only show actions on desktop */}
              {isDesktop && (
                <div className='actions'>
                  <button onClick={() => { fetchWishlists(); openModal(); closeMobileMenu(); }} className='btn desktop-add-wish'> <AiOutlinePlus /> Add Wish </button>
                  
                  {/* Help Button */}
                  <div className="relative desktop-help-icon">
                    <AiFillQuestionCircle className="text-2xl cursor-pointer" onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)} />
                    {isHelpMenuOpen && <HelpMenu closeMenu={() => setIsHelpMenuOpen(false)} />}
                  </div>

                  {/* Profile Button */}
                  <div className="relative desktop-profile-icon">
                    {profile ? (
                      <img 
                        src={profile.picture} 
                        className={`w-8 h-8 rounded-full cursor-pointer object-cover ${profile.pro ? "ring-2 ring-[#5651e5]" : ""}`}
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        alt="Profile"
                      />
                    ) : (
                      <AiOutlineUser 
                        className="text-2xl cursor-pointer" 
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                      />
                    )}
                    
                    {profile && isProfileMenuOpen && <ProfileMenu 
                      logOut={() => {setIsLoggedIn(false); localStorage.removeItem("token")}}
                      closeMenu={() => setIsProfileMenuOpen(false)} 
                      profile={profile}
                      token={token}
                      notifications={notifications}
                      deleteNotification={deleteNotification}
                      />}
                  </div>
                </div>
              )}
            </div>

            {/* Floating action button for mobile */}
            {!isDesktop && (
              <button 
                onClick={() => { fetchWishlists(); openModal(); }} 
                className='mobile-add-wish-btn'
              >
                <AiOutlinePlus size={24} />
              </button>
            )}
          </nav>

          <CreateItemDialog 
            open={isModalOpen} 
            setOpen={setIsModalOpen} 
            image={imagePreview}
            setImage={setImagePreview} 
            newItem={newItem}
            setNewItem={setNewItem}
            wishlists={wishlists}
            token={token}
          />
        </>
      ) : (
        <div className='navbar'>
          <div className='container1'>
            <NavLink to="/landing" className='logo'>
              <h1><span><AiFillGift />Wish</span>ify</h1>
            </NavLink>
            
            {/* Mobile menu button for logged out state - only show on mobile */}
            {!isDesktop && (
              <div className="mobile-header-icons">
                <div className='mobile-menu-button' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </div>
              </div>
            )}

            {/* Mobile menu for logged out state - only show on mobile when open */}
            {!isDesktop && (
              <div className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <a href='/Register' className='nav-link' onClick={closeMobileMenu}>
                  Sign Up
                </a>
                <a href='/Login' className='nav-link' onClick={closeMobileMenu}>
                  Log In
                </a>
              </div>
            )}

            {/* Desktop buttons for logged out state - only show on desktop */}
            {isDesktop && (
              <div className='container2'>
                <a href='/Register'><button className='btn'>Sign Up</button></a>
                <a href='/Login'><button className='btn'>Log In</button></a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;