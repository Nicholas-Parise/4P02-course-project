import {useEffect, useState} from 'react';
import { useParams, useLocation } from "react-router-dom"
import { type Wishlist, WishlistItem, Event, Contribution } from '../types/types';
import WishlistHeader from '../components/WishlistHeader';
import WishlistItemEntry from '../components/WishlistItemEntry';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IconButton } from '@mui/material';
import Alert from "@mui/material/Alert";

const Wishlist = () => {
    const navigate = useNavigate();

    const { id } = useParams();

    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
    const [wishlistContributions, setWishlistContributions] = useState<Contribution[]>([])
    //const [error, setError] = useState(null)
    //const [loading, setLoading] = useState(false)
    const [token] = useState<string>(localStorage.getItem('token') || '')
    const [sortDirection, setSortDirection] = useState<-1 | 1>(1)

    const editWishlistItem = (item: WishlistItem) => {
      const index = wishlistItems.findIndex(i => i.id === item.id);
      const newArray = [...wishlistItems] 
      newArray[index] = item
      setWishlistItems(newArray)
    }

    // Fetch page data onload
    useEffect(() => {
      let status_code = -1
      let url = `https://api.wishify.ca/wishlists/${id}`
      // get wishlist info
      fetch(url, {
        method: 'get',
        headers: new Headers({
          'Authorization': "Bearer "+token
        })
        })
        .then((response) => {
          status_code = response.status
          return response.json();
        })
        .then((data) => {
          if(status_code != 200){
            navigate("/404")
            return
          }
          setWishlist(data.wishlist)
          setWishlistItems(data.items)
          setWishlistContributions(data.contributions)
          setEventID(data.wishlist?.event_id)
        })
        .catch((error) => {
          console.log(error)
          navigate("/404")
        })
    }, [])

    // Count the quantity supplied of each item
    useEffect(() => {
      const map = new Map();
      wishlistItems.map(item => map.set(item.id, 0))
      wishlistContributions.map(contribution => map.set(contribution.item_id, map.get(contribution.item_id) + contribution.quantity))
      const newArray = wishlistItems.map(item => ({
        ...item,
        quantitySupplied: map.get(item.id)
      }))
      setWishlistItems(newArray)
    }, [wishlistContributions])

    // scroll to item on page load if a hash is present in the URL
    const location = useLocation();
    useEffect(() => {
      if (location.hash) {
        const interval = setInterval(() => {
          const element = document.getElementById(location.hash.substring(1));
          if (element) {
            //console.log("Element found:", element);
            element.scrollIntoView({ behavior: "smooth" });
            clearInterval(interval); // Stop checking once the element is found
          }
        }, 100); // Check every 100ms
    
        return () => clearInterval(interval); // Cleanup interval on component unmount
      }
    }, [location]);

    const [wishlist, setWishlist] = useState<Wishlist | undefined>()
    const [eventID, setEventID] = useState()
    const [event, setEvent] = useState<Event | undefined>()


    useEffect(() => {
      if(!eventID || eventID === undefined) return;

      let statusCode = -1
      let url = `https://api.wishify.ca/events/${eventID}`
      // get wishlist info
      fetch(url, {
        method: 'get',
        headers: new Headers({
          'Authorization': "Bearer "+token
        })
        })
        .then((response) => {
          statusCode = response.status
          return response.json();
        })
        .then((data) => {
          if(statusCode == 200){
            setEvent(data)
          }          
        })
        .catch((error) => {
          console.log(error)
        })
    }, [eventID])

    type SortOption = "priority" | "price" | "quantity"

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
    
        if (over && active.id !== over.id && sortBy === "priority") {
          const oldIndex = wishlistItems.findIndex((item) => item.id === active.id)
          const newIndex = wishlistItems.findIndex((item) => item.id === over.id)
          
          const newArray = arrayMove(wishlistItems, oldIndex, newIndex).map((item, index) => ({
            ...item,
            priority: index + 1,
          }))

          setWishlistItems(newArray)
          setPriorityUpdate(true)
        }
    }

  const [priorityUpdate, setPriorityUpdate] = useState<boolean>(false)
  // send updated item priorities to backend 
  useEffect(() => {
    if(!priorityUpdate) return
    setPriorityUpdate(false)

    const priorities = wishlistItems.map((item) => {
      return {
        id: item.id,
        priority: item.priority
      }
    })
    
    const url = `https://api.wishify.ca/items`
    fetch(url, {
      method: 'put',
      headers: new Headers({
          'Authorization': "Bearer "+token,
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        items: priorities
      })
  })
  .then((response) => response.json())
  .then(() => {

  })
  .catch((error) => {
      console.log(error)
  })
  }, [priorityUpdate])

  const [contributeAlert, setContributeAlert] = useState(false);

  // TODO: send to backend contributions
  const handleReserveItem = (item: WishlistItem, reservation: number, note: string) => {
    //console.log(wishlistContributions)
    const contribution = wishlistContributions.find((c) => c.item_id === item.id);
    
    if (contribution) {
      if(reservation == 0){
        const contributionID = contribution.id;
        fetch(`https://api.wishify.ca/contributions/${contributionID}`, {
          method: 'delete',
          headers: new Headers({
              'Authorization': "Bearer "+token,
              'Content-Type': 'application/json'
          }),
          })
          .then((response) => response.json())
          .then((data) => {
              console.log(data)
              setContributeAlert(true);
                // update the wishlists state with the new data
              const updatedContributions = wishlistContributions.filter(contribution =>
                contribution.id !== contributionID
              );
              setWishlistContributions(updatedContributions);
              //setTimeout(() => setContributeAlert(false), 3000); TODO: Add alert for deleting?
              return;
          })
          .catch((error) => {
              console.log(error)
              return
          })
      }
      else{
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
        }
    } else{
      if(reservation == 0) return
      fetch("https://api.wishify.ca/contributions/", {
        method: 'post',
        headers: new Headers({
            'Authorization': "Bearer "+token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            "item_id": item.id,
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
        const newItems = wishlistItems.filter(item => item.id !== id).map((item, index) => {
            item.priority = index + 1
            return item
        })
        setWishlistItems(newItems)
        setPriorityUpdate(true)
      })
      .catch((error) => {
        //setError(error)
        //setLoading(false)
        console.log("Failed to delete wishlist\n" + error)
      })
  }

  const [sortBy, setSortBy] = useState<SortOption>("priority")

  const sortedItems = wishlistItems ? [...wishlistItems].sort((a, b) => {
    if (sortBy === "priority") return (a.priority - b.priority)*sortDirection
    if (sortBy === "price") return (a.price - b.price)*sortDirection
    if (sortBy === "quantity") return (b.quantity - a.quantity)*sortDirection
    return 0
  }) : []

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
                        editWishlistItem={editWishlistItem}
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