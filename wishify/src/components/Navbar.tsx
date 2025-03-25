import { useState } from 'react';
import { NavLink } from "react-router-dom";
import { AiFillGift, AiOutlinePlus, AiOutlineUser, AiFillQuestionCircle } from 'react-icons/ai';
import { Wishlist } from '../types/types';
import { WishlistItem } from '../types/types';
import CreateItemDialog from './CreateItemDialog';
import ProfileMenu from './ProfileMenu';
import HelpMenu from './HelpMenu';
import '../components/Navbarlanding/landingheader.css';

const Navbar = ({ isLoggedIn, setIsLoggedIn, page }: { isLoggedIn: boolean, setIsLoggedIn: (val: boolean)=>void, page: string }) => {
  interface NavItem {
    label: string;
    href: string;
  }

  const [listNav] = useState<NavItem[]>([
    { label: 'Wishlist', href: '/wishlists' },
    { label: 'Events', href: '/events' }
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

  const openModal = () => {
    setNewItem({});
    setImagePreview(null);
    setIsModalOpen(true);
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <nav className='navbar'>
            <div className='container1'>
              <NavLink to="/" className='logo'>
                <h1><span><AiFillGift />Wish</span>ify</h1>
              </NavLink>

              <div className='nav-menu'>
                {listNav.map((item, index) => (
                  <NavLink key={index} to={item.href} className='nav-link'>
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <div className='actions'>
                <button onClick={() => (fetchWishlists(), openModal())} className='btn'>
                  <AiOutlinePlus /> Add Wish
                </button>
                
                {/* Help Icon with Click Event */}
                <div className="relative">
                  <AiFillQuestionCircle
                    className="text-2xl cursor-pointer"
                    onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
                  />
                  
                  {/* Help Menu Component */}
                  {isHelpMenuOpen && <HelpMenu
                    closeMenu={() => setIsHelpMenuOpen(false)} />}
                  
                </div>

                {/* Profile Icon with Click Event */}
                <div className="relative">
                  <AiOutlineUser
                    className="text-2xl cursor-pointer"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  />
                  
                  {/* Profile Menu Component */}
                  {isProfileMenuOpen && <ProfileMenu 
                    logOut={() => {setIsLoggedIn(false), localStorage.removeItem("token")}}
                    closeMenu={() => setIsProfileMenuOpen(false)} />}
                </div>
              </div>
            </div>
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
            page={page}
            id={page.split('/')[2]}
          />
        </>
      ) : (
        <div className='navbar'>
          <div className='container1'>
            <NavLink to="/landing" className='logo'>
              <h1><span><AiFillGift />Wish</span>ify</h1>
            </NavLink>
            <div className='container2'>
              <a href='/Register'><button className='btn'>Sign Up</button></a>
              &nbsp;
              <a href='/Login'><button className='btn'>Log In</button></a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;