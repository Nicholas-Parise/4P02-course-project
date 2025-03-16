import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AiFillGift, AiOutlinePlus, AiOutlineUser } from 'react-icons/ai';
import { useAuth } from '../utils/AuthContext.jsx';
import CreateItemDialog from './CreateItemDialog';
import ProfileMenu from '../components/ProfileMenu.jsx';
import '../components/Navbarlanding/landingheader.css';

const Navbar = () => {
  const { isLoggedIn, logOut } = useAuth(); // Use the useAuth hook
  const [listNav] = useState([
    { label: 'Wishlist', href: '/wishlists' },
    { label: 'Events', href: '/events' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlists, setWishlists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const fetchWishlists = () => {
    const token = localStorage.getItem('token') || '';
    setLoading(true);

    fetch('https://api.wishify.ca/wishlists', {
      method: 'get',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setWishlists(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const openModal = () => {
    setNewItem({});
    setImagePreview(null);
    setIsModalOpen(true);
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <nav className="navbar">
            <div className="container1">
              <NavLink to="/" className="logo">
                <h1>
                  <span>
                    <AiFillGift />
                    Wish
                  </span>
                  ify
                </h1>
              </NavLink>

              <div className="nav-menu">
                {listNav.map((item, index) => (
                  <NavLink key={index} to={item.href} className="nav-link">
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <div className="actions">
                <button onClick={() => (fetchWishlists(), openModal())} className="btn">
                  <AiOutlinePlus /> Add Wish
                </button>
                <div className="profile-icon">
                  <AiOutlineUser
                    className="text-2xl cursor-pointer"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  />

                  {/* Profile Menu Component */}
                  {isProfileMenuOpen && (
                    <ProfileMenu
                      closeMenu={() => setIsProfileMenuOpen(false)}
                      logOut={logOut} // Pass logOut function to ProfileMenu
                    />
                  )}
                </div>
              </div>
            </div>
          </nav>

          <CreateItemDialog
            open={isModalOpen}
            setOpen={setIsModalOpen}
            image={imagePreview} // Pass the image prop
            setImage={setImagePreview} // Pass the setImage prop
            newItem={newItem}
            setNewItem={setNewItem}
            wishlists={wishlists}
            token={localStorage.getItem('token') || ''}
          />
        </>
      ) : (
        <div className="navbar">
          <div className="container1">
            <NavLink to="/landing" className="logo">
              <h1>
                <span>
                  <AiFillGift />
                  Wish
                </span>
                ify
              </h1>
            </NavLink>
            <div className="container2">
              <a href="/Register">
                <button className="btn">Sign Up</button>
              </a>
              &nbsp;
              <a href="/Login">
                <button className="btn">Log In</button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;