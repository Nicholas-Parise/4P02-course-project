import { useState, useEffect } from 'react';
import { type WishlistItem, Contribution } from '../types/types';
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, TextField, IconButton } from '@mui/material';
import { FaExternalLinkAlt, FaMinus, FaPlus, FaChevronDown, FaChevronRight, FaPencilAlt } from 'react-icons/fa';
import { FaTrashCan } from "react-icons/fa6";
import DeleteItemModal from './DeleteItemModal';
import EditItemDialog from './EditItemDialog';

type WishlistItemProps = {
  item: WishlistItem,
  editWishlistItem: (item: WishlistItem) => void,
  sortBy: "priority" | "price" | "quantity",
  reservations: Contribution[] | undefined,
  onReserve: (item: WishlistItem, reservation: number, note: string) => void,
  id: number,
  onDelete: (id: number) => void,
  userID: number,
  owner: boolean,
  blind: boolean
}

const WishlistItemEntry = ({ item, editWishlistItem, sortBy, reservations, onReserve, id, onDelete, userID, owner, blind }: WishlistItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, } = useSortable({ id, animateLayoutChanges: () => false });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const totalReserved = item.quantitySupplied || 0
  const availableQuantity = item.quantity - totalReserved

  const reservedBadgeColour = availableQuantity <= 0 ? "bg-green-600" : "bg-yellow-500"

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [reserveNote, setReserveNote] = useState("")
  const [userReservation, setUserReservation] = useState<number>(0)
  const [tempUserReservation, setTempUserResrvation] = useState<number>(0)

  const incrementReserve = () => setTempUserResrvation((prev) => Math.min(prev + 1, availableQuantity + userReservation))
  const decrementReserve = () => setTempUserResrvation((prev) => Math.max(prev - 1, 0))

  useEffect(() => {
    if(reservations == null) return
    const contribution = reservations.find(i => i.item_id === item.id && i.user_id === userID)
    if(contribution) {
      setUserReservation(contribution.quantity)
      setReserveNote(contribution.note)
    }
    else {
      setUserReservation(0)
    }
    
  }, [userID])

  useEffect(() => {
    setTempUserResrvation(userReservation)
  }, [userReservation])

  const handleReserve = () => {
    console.log(tempUserReservation, availableQuantity, userReservation)
    if (tempUserReservation > availableQuantity + userReservation) return; // TODO Add alert that there is not enough available quantity
    if (tempUserReservation > 0) {
      //onReserve(item.id, reserveQuantity, currentUser)
      onReserve(item, tempUserReservation, reserveNote)
      setUserReservation(tempUserReservation)
    } else {
      onReserve(item, 0, reserveNote)
      setUserReservation(0)
    }
    setIsModalOpen(false)
  }

  const handleReserveQuantity = (e: any) => {
    if (["e", "E", "-"].some((char) => e.target.value.includes(char))) return;

    // handle change here
    setTempUserResrvation(parseInt(e.target.value) || 0);
  }

  const [showNote, setShowNote] = useState<{ [key: number]: boolean }>({});

  return (
    <>
      <li
        id={id.toString()}
        ref={setNodeRef}
        style={style}
        className="bg-white shadow-md p-4 flex items-center space-x-4 cursor-pointer rounded-[25px] border-2 border-[#5651e5]"
        onClick={() => setIsModalOpen(true)}
      >
        {owner && sortBy === "priority" && (
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
            { owner &&(
              <>
                <IconButton sx={{marginLeft: 2, ":hover":{color:'#5651e5'}}} onClick={(e) => {e.stopPropagation(), setIsEditModalOpen(true)}} className='w-8 h-8'>
                <FaPencilAlt className='transition-[1]'/>
                </IconButton>
                <IconButton sx={{marginLeft: 1, ":hover":{color:'#fb2c36'}}} onClick={(e) => {e.stopPropagation(), setIsDeleteModalOpen(true)}} className='w-8 h-8'>
                <FaTrashCan className='transition-[1]'/>
                </IconButton>
              </>
            )}
            
          </div>
          <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
          <p className="text-gray-600">
          { blind ? 
                  <>
                    Quantity: {item.quantity}
                  </>
                :
                  <>
                    Quantity: {availableQuantity} available / {item.quantity} total
                  </>
              }
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
              { blind ? 
                  <>
                    Quantity: {item.quantity}
                  </>
                :
                  <>
                    Quantity: {availableQuantity} available / {item.quantity} total
                  </>
              }
              
            </p>
            {!blind && reservations && reservations?.length > 0 && (
              <div>
                <p className="font-semibold">Current Reservations:</p>
                {reservations?.map((res, index) => (
                    <div key={index}>
                      <div 
                        className="text-green-600 cursor-pointer flex items-center"
                        onClick={() => {
                          setShowNote((prev) => ({
                            ...prev,
                            [index]: !prev[index],
                          }));
                        }}
                      >
                        <p>{res.user_displayname}: {res.quantity} {res.note ? "(note is attached)" : null}</p>
                        { res.note ? (showNote[index] ? <FaChevronDown className="ml-2" /> : <FaChevronRight className="ml-2" />) : null}
                      </div>
                      {showNote[index] ? <p className="text-gray-600">{res.note}</p> : null}
                    </div>
                ))}
              </div>
            )}
            { !blind && (
              <div className="space-y-2">
                <p className="text-md font-medium text-[#5651e5]">Your Reservation</p>
                <div className="flex items-center space-x-2">
                  <Button onClick={decrementReserve}>
                    <FaMinus className="h-4 w-4 text-[#5651e5]" />
                  </Button>
                  <TextField
                    value={tempUserReservation}
                    onChange={(e) => handleReserveQuantity(e)}
                    className="w-20 text-center"
                  />
                  <Button onClick={incrementReserve}>
                    <FaPlus className="h-4 w-4 text-[#5651e5]" />
                  </Button>
                </div>
                <TextField
                  sx={{width:'100%'}}
                  multiline
                  value={reserveNote}
                  label="Leave a comment"
                  onChange={(e) => setReserveNote(e.target.value)}
                />
              </div>
            )}
            
            <div className="flex space-x-2 gap-2">
              { item.url && (
                <Button
                  className="!text-[#5651e5] !rounded-[25px]" sx={{border: '2px solid #5651e5', '&:hover': { background: '#EDEDFF'}}} // TODO edit this on hover colour to be the same as everything else
                  onClick={() => window.open(item.url, '_blank')}
                >
                  View Item <FaExternalLinkAlt className="ml-2 h-4 w-4" />
                </Button>
              )}
              
              { !blind && (
                <Button
                  className="!rounded-[25px] bg-gradient-to-r from-[#8d8aee] to-[#5651e5] !text-white hover:from-[#5651e5] hover:to-[#343188]"
                  onClick={handleReserve}
                >
                  {userReservation > 0 ? 'Update Reservation' : 'Reserve'}
                </Button>
              )}
            </div>
          </div>
      </DialogContent>
    </Dialog>

    <DeleteItemModal 
      isModalOpen={isDeleteModalOpen}
      setIsModalOpen={setIsDeleteModalOpen}
      onDelete={onDelete}
      item={item}
    />

    <EditItemDialog
      open={isEditModalOpen}
      setOpen={setIsEditModalOpen}
      item={item}
      editWishlistItem={editWishlistItem}
    />
    </>
  )
}

export default WishlistItemEntry