import React from 'react';
import { AiFillGift, AiOutlinePlus, AiOutlineUser } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import '../components/Navbarlanding/landingheader.css';

const Navbar = () => {
    const navItems = [
        { label: 'Wishlist', href: '/wishlists' },
        { label: 'Events', href: '/events' }
    ];

    return (
        <nav className='navbar'>
            <div className='container1'>
                <NavLink to="/" className='logo'>
                    <h1><span><AiFillGift />Wish</span>ify</h1>
                </NavLink>

                <div className='nav-menu'>
                    {navItems.map((item, index) => (
                        <NavLink key={index} to={item.href} className='nav-link'>
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className='actions'>
                    <NavLink to='/wishlists' className='btn'>
                        <AiOutlinePlus /> Add Wish
                    </NavLink>
                    <NavLink to='/profile' className='profile-icon'>
                        <AiOutlineUser />
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;