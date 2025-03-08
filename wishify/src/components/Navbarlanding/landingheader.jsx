import React, {Fragment, useState} from 'react'
import {AiFillGift} from 'react-icons/ai'
import { NavLink } from 'react-router-dom';
import '../Navbarlanding/landingheader.css'

const Navbar = () => {

    return (
        <div className='navbar'>
            <div className='container1'>
                <NavLink to="/landing" className='logo'>
                    <h1><span><AiFillGift />Wish</span>ify</h1>
                </NavLink>
                <div className='container2'>
                    <a href='/Register'><button  className='btn'>Sign Up</button></a>
                    &nbsp;
                    <a href='/Login'><button  className='btn'>Log In</button></a>
                </div>
            </div>
            
        </div>
    )
}

export default Navbar