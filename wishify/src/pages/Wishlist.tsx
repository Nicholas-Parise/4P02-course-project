import {useEffect, useState} from 'react';
import { useParams, useLocation } from "react-router-dom"
import { type Wishlist, WishlistItem, Event, Contribution } from '../types/types';
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
import Alert from "@mui/material/Alert";

const Wishlist = () => {
    const { id } = useParams();

    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
    const [wishlistContributions, setWishlistContributions] = useState<Contribution[]>([])
    //const [error, setError] = useState(null)
    //const [loading, setLoading] = useState(false)
    const [token, setToken] = useState<string>(localStorage.getItem('token') || '')
    const [sortDirection, setSortDirection] = useState<-1 | 1>(1)

    useEffect(() => {
      setToken(localStorage.getItem('token') || '')
      console.log(token)

      let url = `https://api.wishify.ca/wishlists/${id}/items`
      // get all items in wishlist
      fetch(url, {
        method: 'get',
        headers: new Headers({
          'Authorization': "Bearer "+token
        })
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setWishlistItems(data.items)
          //setLoading(false)
        })
        .catch((error) => {
          //setError(error)
          //setLoading(false)
          console.log(error)
        })
        //.finally(() => setLoading(false))
      url = `https://api.wishify.ca/contributions/wishlists/${id}`
      // get all contributions in wishlist
      fetch(url, {
        method: 'get',
        headers: new Headers({
          'Authorization': "Bearer "+token
        })
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          setWishlistContributions(data)
          //setLoading(false)
        })
        .catch((error) => {
          //setError(error)
          //setLoading(false)
          console.log("error" + error)
        })
        //.finally(() => setLoading(false))
    }, [])

    // scroll to item on page load if a hash is present in the URL
    const location = useLocation();
    useEffect(() => {
      if (location.hash) {
        const interval = setInterval(() => {
          const element = document.getElementById(location.hash.substring(1));
          if (element) {
            console.log("Element found:", element);
            element.scrollIntoView({ behavior: "smooth" });
            clearInterval(interval); // Stop checking once the element is found
          }
        }, 100); // Check every 100ms
    
        return () => clearInterval(interval); // Cleanup interval on component unmount
      }
    }, [location]);

    const wishlist: Wishlist = {
        id: 0,
        eventID: 0,
        name: "Geoff's Christmas Wishlist",
        desc: "This is my wishlist for Christmas 2026",
        image: ""
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


  const [contributeAlert, setContributeAlert] = useState(false);
  // TODO: send to backend contributions
  const handleReserveItem = (itemId: number, reservation: number, note: string) => {
    console.log(wishlistContributions)
    const contribution = wishlistContributions.find((c) => c.item_id === itemId);
    if (contribution) {
      console.log(contribution)
      const contributionID = contribution.id;
      console.log("already reserved")
      fetch(`https://api.wishify.ca/contributions/${contributionID}`, {
        method: 'put',
        headers: new Headers({
            'Authorization': "Bearer "+token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            "quantity": reservation,
            "purchased": false,
            "note": note || ""
        })})
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            setContributeAlert(true);
              // update the wishlists state with the new data
            const updatedContributions = wishlistContributions.map(contribution =>
              contribution.id === contributionID ? data.contribution : contribution
            );
            setWishlistContributions(updatedContributions);
            setTimeout(() => setContributeAlert(false), 3000); // auto fade after 3 seconds
            return;
        })
        .catch((error) => {
            console.log(error)
            return
        })
    } else{
      itemId + reservation;
    
      fetch("https://api.wishify.ca/contributions/", {
        method: 'post',
        headers: new Headers({
            'Authorization': "Bearer "+token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            "item_id": itemId,
            "quantity": reservation,
            "purchased": false,
            "note": note || ""
        })})
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (data.message == "contribution created successfully"){
              setContributeAlert(true);
              setWishlistContributions([...wishlistContributions, data.contribution])
              setTimeout(() => setContributeAlert(false), 3000); // auto fade after 3 seconds
            }
        })
        .catch((error) => {
            console.log(error)
            return
        })
      }
  }

  const getItemReservations = (itemId: number) => {
    const itemReservations = wishlistContributions.filter((c) => c.item_id === itemId)
    return itemReservations
  }

  const deleteItem = (id: number) => {
    // send delete request
    fetch(`https://api.wishify.ca/items/${id}`, {
      method: 'delete',
      headers: new Headers({
        'Authorization': "Bearer "+token
      })
      })
      .then((response) => {
        return response.json();
      })
      .then(() => {
        // remove from array
        const newItems = wishlistItems.filter(item => item.id !== id)
        setWishlistItems(newItems)
      })
      .catch((error) => {
        //setError(error)
        //setLoading(false)
        console.log("Failed to delete wishlist\n" + error)
      })

   
  }

  return (
    <>
      <section className='pt-5'>
          <WishlistHeader wishlist={wishlist} event={event} />
          <div className="mt-8 mb-4 flex gap-1 items-center">
              <FormControl fullWidth className='min-w-[120px] max-w-[180px] '>
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
          { sortedItems.length === 0 ? <section><p className="text-center text-gray-500">No items in your wishlist.</p><p className="text-center text-gray-500">Start adding them by clicking the Add Wish button!</p></section> :
          <DndContext onDragEnd={handleDragEnd}>
              <SortableContext items={sortedItems.map((item) => item.id)}>
                  <ul className="space-y-4">
                  {sortedItems.map((item) => (
                      <WishlistItemEntry 
                        id={item.id} 
                        key={item.id} 
                        item={item} 
                        sortBy={sortBy} 
                        reservations={getItemReservations(item.id)} 
                        onReserve={handleReserveItem}
                        onDelete={deleteItem}
                      />
                  ))}
                  </ul>
              </SortableContext>
          </DndContext>
          }
      </section>   
      <Alert severity="success" sx={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, opacity: contributeAlert ? 1 : 0, transition: contributeAlert ? "none" : "opacity 1s ease-out"}}>
        Reservation successfully added.
      </Alert>

    </>
  );
}

export default Wishlist