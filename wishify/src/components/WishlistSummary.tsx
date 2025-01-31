import React from 'react'
import { Wishlist, Event } from '../types/types';
import styles from '../pages/Wishlist.scss'
import { Link } from 'react-router-dom';

const WishlistSummary = ({wishlist, event} : {wishlist: Wishlist, event: Event}) => {
  return (
    <div className="text-center m-10 p-10 grid grid-cols-2 border-b-3">
        <div>
            <h1 className='text-4xl font-bold'>{wishlist.name}</h1>
            {wishlist.desc}
        </div>
        <div>   
            <h2 className='text-3xl font-bold'>Event Information</h2>
            <h3><Link to={event.url}>{event.name}</Link></h3>
            {event.desc}
            <br />
            {event.address}
            <br />
            {event.city}
        </div>
    </div>
  )
}

export default WishlistSummary