import React from 'react'

import {FaFacebook, FaInstagram, FaTwitter, FaPinterest} from 'react-icons/fa'

import '../FooterLanding/Footer.css'

const Footer = () => {
    return (
        <div className='footer'>
            <div className='social'>
                <FaFacebook className='icon' />
                <FaInstagram className='icon' />
                <FaTwitter className='icon' />
                <FaPinterest className='icon' />
            </div>
            <div className='container'>
                <div className='col'>
                    <h3>About</h3>
                    <p>...</p>
                    <p>...</p>
                    <p>...</p>
                    <p>...</p>
                </div>
                <div className='col'>
                    <h3>Information</h3>
                    <p>...</p>
                    <p>...</p>
                    <p>...</p>
                    <p>...</p>
                </div>
            </div>
        </div>
    )
}

export default Footer