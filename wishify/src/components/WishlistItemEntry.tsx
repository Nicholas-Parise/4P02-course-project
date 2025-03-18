import { useState, useEffect } from 'react';
import { type WishlistItem } from '../types/types';
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, TextField } from '@mui/material';
import { FaExternalLinkAlt, FaMinus, FaPlus } from 'react-icons/fa';

type WishlistItemProps = {
  item: WishlistItem,
  sortBy: "priority" | "price" | "quantity"
  onReserve: (itemId: number, reservation: number, note: string) => void
}

const WishlistItemEntry = ({ item, sortBy, onReserve }: WishlistItemProps) => {
  const id = item.id;
  const { attributes, listeners, setNodeRef, transform, transition, } = useSortable({ id, animateLayoutChanges: () => false });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isDraggable = sortBy === "priority"
  const currentUser = 1  //In a real app, this would come from authentication
  const totalReserved = item.quantitySupplied || 0
  const userReservation = item.contributions?.find((r) => r.member_id === currentUser)
  const availableQuantity = item.quantity - totalReserved

  const reservedBadgeColour = availableQuantity <= 0 ? "bg-green-600" : "bg-yellow-500"

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reserveQuantity, setReserveQuantity] = useState(0)
  const [reserveNote, setReserveNote] = useState("")

  const incrementReserve = () => setReserveQuantity((prev) => Math.min(prev + 1, availableQuantity))
  const decrementReserve = () => setReserveQuantity((prev) => Math.max(prev - 1, 0))

  useEffect(() => {
    setReserveQuantity(userReservation?.quantity || 0)
  }, [userReservation])

  const handleReserve = () => {
    if (reserveQuantity > 0) {
      //onReserve(item.id, reserveQuantity, currentUser)
      onReserve(item.id, reserveQuantity, reserveNote)
    } else {
      //onReserve(item.id, 0, currentUser)  Remove reservation if quantity is 0
      onReserve(item.id, 0, reserveNote)
    }
    setIsModalOpen(false)
  }

  const handleReserveQuantity = (e: any) => {
    if (["e", "E", "-"].some((char) => e.target.value.includes(char))) return;

    // handle change here
    setReserveQuantity(parseInt(e.target.value) || NaN);
  }

  return (
    <>
      <li
        ref={setNodeRef}
        style={style}
        className="bg-white shadow-md p-4 flex items-center space-x-4 cursor-pointer rounded-[25px] border-2 border-[#5651e5]"
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
        <div className="flex-shrink-0 p-3 h-8 bg-[#5651e5] text-white rounded-full flex items-center justify-center">
          {item.priority}
        </div>
    </li>

    <Dialog 
      open={isModalOpen} 
      onClose={() => setIsModalOpen(false)}
      aria-labelledby="item-dialog-title"
      aria-describedby="item-dialog-description"
      PaperProps={{
        style: {
          border: '2px solid #5651e5',
          borderRadius: '25px',
          minWidth: '400px', // Ensure min width
        },
      }}
    >
      <DialogTitle id="item-dialog-title" className="text-[#5651e5]">
        <div className="text-center font-bold">{item.name}</div>
      </DialogTitle>
      <DialogContent className="sm:max-w-[425px]">
          <DialogContentText id="alert-dialog-description" className="text-[#5651e5] text-center">
            Item Details
          </DialogContentText>
          <div className="grid gap-4 py-4">
            <div className="relative">
              <img src={item.image || "/placeholder.svg"} alt={item.name}/>
            </div>
            <p className="text-gray-700">{item.description}</p>
            <p className="font-semibold text-[#5651e5]">Price: ${item.price.toFixed(2)}</p>
            <p className="text-gray-600">
              Quantity: {availableQuantity} available / {item.quantity} total
            </p>
            {item.contributions?.length > 0 && (
              <div>
                <p className="font-semibold">Current Reservations:</p>
                {item.contributions?.map((res, index) => (
                  <p key={index} className="text-green-600">
                    {res.member_id}: {res.quantity}
                  </p>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <p className="text-md font-medium text-[#5651e5]">Your Reservation</p>
              <div className="flex items-center space-x-2">
                <Button onClick={decrementReserve}>
                  <FaMinus className="h-4 w-4 text-[#5651e5]" />
                </Button>
                <TextField
                  value={reserveQuantity}
                  onChange={(e) => handleReserveQuantity(e)}
                  className="w-20 text-center"
                />
                <Button onClick={incrementReserve}>
                  <FaPlus className="h-4 w-4 text-[#5651e5]" />
                </Button>
              </div>
              <TextField
                value={reserveNote}
                label="Leave a comment"
                onChange={(e) => setReserveNote(e.target.value)}
              />
            </div>
            <div className="flex space-x-2 gap-2">
              <Button
                className="!text-[#5651e5] !rounded-[25px]" sx={{border: '2px solid #5651e5', '&:hover': { background: '#EDEDFF'}}} // TODO edit this on hover colour to be the same as everything else
                onClick={() => window.open(item.url, '_blank')}
              >
                Purchase <FaExternalLinkAlt className="ml-2 h-4 w-4" />
              </Button>
              <Button
                className="!rounded-[25px] bg-gradient-to-r from-[#8d8aee] to-[#5651e5] !text-white hover:from-[#5651e5] hover:to-[#343188]"
                onClick={handleReserve}
              >
                {userReservation ? 'Update Reservation' : 'Reserve'}
              </Button>
            </div>
          </div>

          
      </DialogContent>
    </Dialog>
    </>
  )
}

export default WishlistItemEntry