//import React, { useState, useEffect } from 'react';
import {useState} from 'react';
import { useParams } from "react-router-dom"
import { type Wishlist, WishlistItem, Event } from '../types/types';
import WishlistSummary from '../components/WishlistSummary';
import ListOfWishes from '../components/ListOfWishes';

const Wishlist = () => {
  const { id } = useParams();

  console.log(id);

    // Static test data
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
        {
            name: "Nintendo Switch",
            desc: "I would really like this console!",
            url: "https://www.amazon.ca/Nintendo-SwitchTM-OLED-Model-White/dp/B098RKWHHZ/ref=asc_df_B098RKWHHZ/?tag=googleshopc0c-20&linkCode=df0&hvadid=706746737269&hvpos=&hvnetw=g&hvrand=1937906087861263014&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9000777&hvtargid=pla-1392422079323&mcid=d4b1318c9ba332afbf7bb541f05c9926&gad_source=1&th=1",
            imageSrc: "https://m.media-amazon.com/images/I/61nqNujSF2L._AC_SL1330_.jpg",
            quantity: 1,
            quantitySupplied: 1,
            dateUpdated: "Wednesday, January 29th 2025",
            id: 1,
            priority: 1,
            price: 450
        },
        {
            name: "Nintendo Switch 2",
            desc: "I would really like this console!",
            url: "https://www.amazon.ca/Nintendo-SwitchTM-OLED-Model-White/dp/B098RKWHHZ/ref=asc_df_B098RKWHHZ/?tag=googleshopc0c-20&linkCode=df0&hvadid=706746737269&hvpos=&hvnetw=g&hvrand=1937906087861263014&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9000777&hvtargid=pla-1392422079323&mcid=d4b1318c9ba332afbf7bb541f05c9926&gad_source=1&th=1",
            imageSrc: "https://imageio.forbes.com/specials-images/imageserve/6790213615a25651ff368372/nintendo-switch-2-hero-indybest/960x0.png?format=png&width=960",
            quantity: 1,
            quantitySupplied: 0,
            dateUpdated: "Wednesday, January 29th 2025",
            id: 2,
            priority: 2,
            price: 500
        },
        {
            name: "PS5 Pro",
            desc: "I would really like this console!",
            url: "https://www.amazon.ca/PlayStation-CFI-7019B01X-5-Pro-Console/dp/B0DGYL8TDZ",
            imageSrc: "https://multimedia.bbycastatic.ca/multimedia/products/500x500/184/18477/18477929.jpg",
            quantity: 1,
            quantitySupplied: 0,
            dateUpdated: "Wednesday, January 29th 2025",
            id: 3,
            priority: 3,
            price: 960
        },
        {
            name: "Hot dogs",
            desc: "I'm hungry'",
            url: "https://www.amazon.ca/PlayStation-CFI-7019B01X-5-Pro-Console/dp/B0DGYL8TDZ",
            imageSrc: "https://i5.walmartimages.ca/images/Enlarge/020/808/627735020808.jpg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
            quantity: 5,
            quantitySupplied: 3,
            dateUpdated: "Wednesday, January 29th 2025",
            id: 4,
            priority: 3,
            price: 5
        },
    ]);

    const wishlist: Wishlist = {
        eventID: 0,
        name: "Geoff's Christmas Wishlist",
        desc: "This is my wishlist for Christmas 2026"
    };

    const event: Event = {
        name: "Jensen family Christmas",
        desc: 'Description',
        url: 'url??',
        dateUpdated: 'yesterday',
        address: '100 Polar Express Way',
        city: 'North Pole'
    };

  return (
    <section>
        <WishlistSummary wishlist={wishlist} event={event} />
        <ListOfWishes wishlistItems={wishlistItems} setWishlistItems={setWishlistItems} />
    </section>   
  );
}

export default Wishlist