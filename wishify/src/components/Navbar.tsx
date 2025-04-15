import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { AiFillGift, AiOutlinePlus, AiOutlineUser, AiFillQuestionCircle, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Wishlist } from '../types/types';
import { WishlistItem } from '../types/types';
import CreateItemDialog from './CreateItemDialog';
import ProfileMenu from './ProfileMenu';
import HelpMenu from './HelpMenu';
import '../components/landingheader.css';

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

  const [token, setToken] = useState<string>(localStorage.getItem('token') || '');
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

  const fetchWishlists = () => {
    const token = localStorage.getItem('token') || '';
    setToken(token);
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

  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [pro, setPro] = useState<boolean>(false);
  
  useEffect(() => {
    setToken(localStorage.getItem('token') || '')
    console.log(token)
    fetch("https://api.wishify.ca/users/", {
        method: 'get',
        headers: new Headers({
          'Authorization': "Bearer "+token
        })
      })
        .then((response) => response.json())
        .then((data) => {
          setDisplayName(data.user.displayname)
          setEmail(data.user.email)
          setPro(data.user.pro)
          console.log(data)
          //setLoading(false)
        })
        .catch((error) => {
          //setError(error)
          //setLoading(false)
          console.log(error)
        })
        //.finally(() => setLoading(false))
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
                
                <AiOutlineUser className="text-2xl cursor-pointer" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} />
                {isProfileMenuOpen && <ProfileMenu 
                      logOut={() => {setIsLoggedIn(false); localStorage.removeItem("token")}}
                      closeMenu={() => setIsProfileMenuOpen(false)} 
                      profile={{displayName, email,pro}}
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
                    <AiOutlineUser className="text-2xl cursor-pointer" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} />
                    
                    {isProfileMenuOpen && <ProfileMenu 
                      logOut={() => {setIsLoggedIn(false); localStorage.removeItem("token")}}
                      closeMenu={() => setIsProfileMenuOpen(false)} 
                      profile={{displayName, email,pro}}
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
                &nbsp;
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