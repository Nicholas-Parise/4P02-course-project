import React from 'react';
import { NavLink } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";



const Navbar = () => {
  return (
    <div>    

        <nav>
            <ul>
                <li>
                  <NavLink to="/home">Home</NavLink>
                </li>

                <li>
                  <NavLink to="/wishlists">Wishlist</NavLink>
                </li>
                <li>
                  <NavLink to="/events">Events</NavLink>
                </li>
                <li>
                    <NavLink to="/login">login</NavLink>
                </li>
                <li>
                    <NavLink to="/register">Signup</NavLink>
                </li>
                
            </ul>
        </nav>

    </div>
  )
}

export default Navbar


