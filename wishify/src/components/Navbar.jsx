import React from 'react';
import { Nav, NavMenu, NavLink, Bars, NavNameLabel } from "./NavbarElements"
import WishifyLogo from "./WishifyLogo"

const Navbar = (props) => {
    return (
      <>
          <Nav>
              <NavLink to="/home"><WishifyLogo/></NavLink>
              <Bars/>
              <NavMenu>
                  <NavLink to="/wishlists">Wishlist</NavLink>
                  <NavLink to="/events">Events</NavLink>
              </NavMenu>
              {props.name == "" ?               
              <NavMenu>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Sign Up</NavLink>
              </NavMenu>
              : <NavNameLabel>{props.name}</NavNameLabel>}  {/*Show login and sign up only if user is logged in, otherwise show their name (will be a button eventually)*/}
          </Nav>
      </>
    )
}

export default Navbar


