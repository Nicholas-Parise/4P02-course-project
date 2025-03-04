import {useEffect, useState} from 'react';
import { useParams } from "react-router-dom"
import { type Wishlist, WishlistItem, Event } from '../types/types';
import WishlistHeader from '../components/WishlistHeader';
import WishlistItemEntry from '../components/WishlistItemEntry';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { FaArrowUp } from 'react-icons/fa';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IconButton } from '@mui/material';

const Wishlist = () => {
    const { id } = useParams();

    /* Static test data
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
            price: 450,
            contributions: []
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
            price: 500,
            contributions: []
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
            price: 960,
            contributions: []
        },
        {
            name: "Hot dogs",
            desc: "I'm hungry",
            url: "https://www.amazon.ca/PlayStation-CFI-7019B01X-5-Pro-Console/dp/B0DGYL8TDZ",
            imageSrc: "https://i5.walmartimages.ca/images/Enlarge/020/808/627735020808.jpg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
            quantity: 5,
            quantitySupplied: 3,
            dateUpdated: "Wednesday, January 29th 2025",
            id: 4,
            priority: 3,
            price: 5,
            contributions: []
        },
    ]);
    */

    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
    //const [error, setError] = useState(null)
    //const [loading, setLoading] = useState(false)
    const [token, setToken] = useState<string>(localStorage.getItem('token') || '')
    const [sortDirection, setSortDirection] = useState<-1 | 1>(1)

    useEffect(() => {
        setToken(localStorage.getItem('token') || '')
        console.log(token)

        const url = `https://api.wishify.ca/wishlists/${id}/items`

        fetch(url, {
            method: 'get',
            headers: new Headers({
              'Authorization': "Bearer "+token
            })
          })
            .then((response) => response.json())
            .then((data) => {
              setWishlistItems(data.items);
              //setLoading(false)
            })
            .catch((error) => {
              //setError(error)
              //setLoading(false)
              console.log(error)
            })
            //.finally(() => setLoading(false))
    }, [])

    const wishlist: Wishlist = {
        id: 0,
        eventID: 0,
        name: "Geoff's Christmas Wishlist",
        desc: "This is my wishlist for Christmas 2026"
    };

    const event: Event = {
        id: 0,
        name: "Jensen family Christmas",
        desc: 'Description',
        url: '../events/1234',
        dateUpdated: 'yesterday',
        dateCreated: 'yesterday',
        image: "",
        addr: '100 Polar Express Way',
        city: 'North Pole'
    };

    type SortOption = "priority" | "price" | "quantity"


    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
    
        if (over && active.id !== over.id && sortBy === "priority") {
          setWishlistItems((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over.id)
    
            return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
              ...item,
              priority: index + 1,
            }))
          })
        }
    }

  const [sortBy, setSortBy] = useState<SortOption>("priority")

  const sortedItems = wishlistItems ? [...wishlistItems].sort((a, b) => {
    if (sortBy === "priority") return (a.priority - b.priority)*sortDirection
    if (sortBy === "price") return (a.price - b.price)*sortDirection
    if (sortBy === "quantity") return (b.quantity - a.quantity)*sortDirection
    return 0
  }) : []

  
  // TODO: send to backend contributions
  const handleReserveItem = (itemId: number, reservation: number, user: string) => {
    itemId + reservation;
    console.log(user)
  }

  return (
    <section>
        <WishlistHeader wishlist={wishlist} event={event} />
        <div className="mt-8 mb-4 flex gap-1 items-center">
            <FormControl fullWidth className='min-w-[120px] max-w-[180px]'>
                <InputLabel id="sort-select-label">Sort by</InputLabel>
                <Select
                    labelId="sort-select-label"
                    id="sort-select"
                    value={sortBy}
                    label="Sort by"
                    onChange={(event: SelectChangeEvent) => setSortBy(event.target.value as SortOption)}
                >
                    <MenuItem value={'priority'}>Priority</MenuItem>
                    <MenuItem value={'price'}>Price</MenuItem>
                    <MenuItem value={'quantity'}>Quantity</MenuItem>
                </Select>
            </FormControl>
            <IconButton className='w-12 h-12' onClick={() => setSortDirection(sortDirection === 1 ? -1 : 1)}>
                <FaArrowUp className={`transition-[1]  ${sortDirection === -1 ? 'rotate-180' : 'rotate-0'}`} />
            </IconButton>
        </div>
      
        <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={sortedItems.map((item) => item.id)}>
                <ul className="space-y-4">
                {sortedItems.map((item) => (
                    <WishlistItemEntry key={item.id} item={item} sortBy={sortBy} onReserve={handleReserveItem} />
                ))}
                </ul>
            </SortableContext>
        </DndContext>
      
    </section>   
  );
}

export default Wishlist