import { useState, ReactNode } from 'react'
import { NavLink } from "react-router-dom";

const Navbar = () => {

  interface NavItem{
    label: string,
    href: string
  }

  const [listNav] = useState([
    {'label':'Home', 'href':'/'},
    {'label':'Landing', 'href':'/landing'},
    {'label':'Wishlist', 'href':'/wishlists'},
    {'label':'Events', 'href':'/events'},
    {'label':'Login', 'href':'/login'},
    {'label':'Sign up', 'href':'/register'}
  ])

  return (
    <div>    

        <nav>
          {listNav.map((value: NavItem, key): ReactNode => {
            return <NavLink key={key} to={value.href}>{value.label}</NavLink>
          })}
        </nav>

    </div>
  )
}

export default Navbar


