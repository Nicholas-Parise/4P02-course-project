import { useState, useEffect } from 'react';
import { type WishlistItem } from '../types/types';
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, TextField } from '@mui/material';
import { FaExternalLinkAlt, FaMinus, FaPlus } from 'react-icons/fa';

type WishlistItemProps = {
  item: WishlistItem,
  sortBy: "priority" | "price" | "quantity"
  onReserve: (itemId: number, reservation: number, user: string) => void
}

const WishlistItemEntry = ({ item, sortBy, onReserve }: WishlistItemProps) => {
  const id = item.id;
  const { attributes, listeners, setNodeRef, transform, transition, } = useSortable({ id, animateLayoutChanges: () => false });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isDraggable = sortBy === "priority"
  const currentUser = "Current User" // In a real app, this would come from authentication
  const totalReserved = item.quantitySupplied || 0
  const userReservation = item.contributions?.find((r) => r.user === currentUser)
  const availableQuantity = item.quantity - totalReserved

  const reservedBadgeColour = availableQuantity <= 0 ? "bg-green-600" : "bg-yellow-500"

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reserveQuantity, setReserveQuantity] = useState(0)

  const incrementReserve = () => setReserveQuantity((prev) => Math.min(prev + 1, availableQuantity))
  const decrementReserve = () => setReserveQuantity((prev) => Math.max(prev - 1, 0))

  useEffect(() => {
    setReserveQuantity(userReservation?.quantity || 0)
  }, [userReservation])

  const handleReserve = () => {
    if (reserveQuantity > 0) {
      onReserve(item.id, reserveQuantity, currentUser)
    } else {
      onReserve(item.id, 0, currentUser) // Remove reservation if quantity is 0
    }
    setIsModalOpen(false)
  }

  return (
    <>
      <li
        ref={setNodeRef}
        style={style}
        className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {isDraggable && (
          <div {...attributes} {...listeners} className="cursor-move" onClick={(e) => e.stopPropagation()}>
            <svg {...attributes} {...listeners} className='w-6 cursor-move touch-none outline-none fill-gray-700' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M96 32H32C14.3 32 0 46.3 0 64v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32zm0 160H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32zm0 160H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32zM288 32h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32zm0 160h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32zm0 160h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32z"/></svg>
          </div>
        )}
        <div className="flex-shrink-0 w-16 h-16 relative">
          <img src={item.image || "/placeholder.svg"} alt={item.name}/>
        </div>
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <h3 className="text-2xl font-semibold">{item.name}</h3>
            {totalReserved > 0 && 
              <div className={`${reservedBadgeColour} p-3 flex-shrink-0 h-8 text-xl font-semibold text-white rounded-full flex items-center justify-center`}>
                {availableQuantity <= 0 ? "Fully Reserved" : "Partially Reserved"}
              </div>
            }
          </div>
          <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
          <p className="text-gray-600">
            Quantity: {availableQuantity} available / {item.quantity} total
          </p>
        </div>
        <div className="flex-shrink-0 p-3 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
          {item.priority}
        </div>
    </li>

    <Dialog 
      open={isModalOpen} 
      onClose={() => setIsModalOpen(false)}
      aria-labelledby="item-dialog-title"
      aria-describedby="item-dialog-description"
    >
      <DialogTitle id="item-dialog-title">
          {item.name}
      </DialogTitle>
      <DialogContent className="sm:max-w-[425px]">
          <DialogContentText id="alert-dialog-description">
            Item Details
          </DialogContentText>
          <div className="grid gap-4 py-4">
            <div className="relative">
              <img src={item.image || "/placeholder.svg"} alt={item.name}/>
            </div>
            <p className="text-gray-700">{item.description}</p>
            <p className="font-semibold">Price: ${item.price.toFixed(2)}</p>
            <p className="text-gray-600">
              Quantity: {availableQuantity} available / {item.quantity} total
            </p>
            {item.contributions?.length > 0 && (
              <div>
                <p className="font-semibold">Current Reservations:</p>
                {item.contributions?.map((res, index) => (
                  <p key={index} className="text-green-600">
                    {res.user}: {res.quantity}
                  </p>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <p className="text-md font-medium">Your Reservation</p>
              <div className="flex items-center space-x-2">
                <Button onClick={decrementReserve}>
                  <FaMinus className="h-4 w-4" />
                </Button>
                <TextField
                  value={reserveQuantity}
                  className="w-20 text-center"
                />
                <Button onClick={incrementReserve}>
                  <FaPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  Purchase <FaExternalLinkAlt className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button onClick={handleReserve}>
                {userReservation ? "Update Reservation" : "Reserve"}
              </Button>
            </div>
          </div>

          
      </DialogContent>
    </Dialog>
    </>
  )
}

export default WishlistItemEntry