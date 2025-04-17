import { useState, useEffect } from 'react';
import { type WishlistItem, Contribution, Member } from '../types/types';
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, TextField, IconButton, Typography, Checkbox } from '@mui/material';
import { FaExternalLinkAlt, FaMinus, FaPlus, FaChevronDown, FaChevronRight, FaPencilAlt, FaTimes } from 'react-icons/fa';
import { FaTrashCan } from "react-icons/fa6";
import DeleteItemModal from './DeleteItemModal';
import EditItemDialog from './EditItemDialog';
import { Link } from 'react-router-dom';

type WishlistItemProps = {
  item: WishlistItem,
  editWishlistItem: (item: WishlistItem) => void,
  sortBy: "priority" | "price" | "quantity",
  reservations: Contribution[] | undefined,
  onReserve: (item: WishlistItem, reservation: number, note: string, purchased: boolean) => void,
  id: number,
  onDelete: (id: number) => void,
  userID: number,
  owner: boolean,
  blind: boolean,
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
  const [purchased, setPurchased] = useState<boolean>(false)
  const [tempUserReservation, setTempUserResrvation] = useState<number>(0)

  const incrementReserve = () => setTempUserResrvation((prev) => Math.min(prev + 1, availableQuantity + userReservation))
  const decrementReserve = () => setTempUserResrvation((prev) => Math.max(prev - 1, 0))

  useEffect(() => {
    if(reservations == null) return
    const contribution = reservations.find(i => i.item_id === item.id && i.user_id === userID)
    if(contribution) {
      setUserReservation(contribution.quantity)
      setReserveNote(contribution.note)
      setPurchased(contribution.purchased)
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
      onReserve(item, tempUserReservation, reserveNote, purchased)
      setUserReservation(tempUserReservation)
    } else {
      onReserve(item, 0, reserveNote, purchased)
      setUserReservation(0)
    }
    setIsModalOpen(false)
  }

  const handleReserveQuantity = (e: any) => {
    if (["e", "E", "-"].some((char) => e.target.value.includes(char))) return;

    // handle change here
    setTempUserResrvation(parseInt(e.target.value) || 0);
  }

  return (
    <>
      <li
        id={id.toString()}
        ref={setNodeRef}
        style={style}
        className="bg-white shadow-md p-3 flex flex-col sm:items-center sm:flex-row-reverse gap-3 sm:gap-4 cursor-pointer rounded-[25px] border-2 border-[#5651e5]"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:ml-auto">
          <div className="flex-shrink-0 px-3 py-1 h-7 bg-[#5651e5] text-white rounded-full flex items-center justify-center text-sm">
            {item.priority}
          </div>
          
          {owner && (
            <div className="flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsEditModalOpen(true); }}
                className="p-2 text-[#5651e5] hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <FaPencilAlt className='text-sm'/>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsDeleteModalOpen(true); }}
                className="p-2 text-[#fb2c36] hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <FaTrashCan className='text-sm'/>
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center w-full sm:w-auto gap-3">
          {owner && sortBy === "priority" && (
            <div 
              {...attributes} 
              {...listeners} 
              className="cursor-move flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <svg 
                className='w-5 sm:w-6 cursor-move touch-none outline-none fill-gray-700' 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 320 512"
              >
                <path d="M96 32H32C14.3 32 0 46.3 0 64v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32zm0 160H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32zm0 160H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32zM288 32h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32zm0 160h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32zm0 160h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32z"/>
              </svg>
            </div>
          )}
          
          <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative">
            <img 
              src={item.image || "/placeholder.svg"} 
              alt={item.name}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <h3 className="text-lg sm:text-xl font-semibold truncate">{item.name}</h3> 
              
              {totalReserved > 0 && 
                <div className={`${reservedBadgeColour} w-fit px-2 py-1 sm:px-3 sm:py-1 h-6 sm:h-7 text-xs sm:text-sm font-semibold text-white rounded-full flex-shrink-0`}>
                  {availableQuantity <= 0 ? "Fully Reserved" : "Partially Reserved"}
                </div>
              }
            </div>
            
            <div className="flex flex-wrap gap-x-4 mt-1">
              <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
              <p className="text-gray-600 text-sm">
                {blind ? `Qty: ${item.quantity}` : `Available: ${availableQuantity}/${item.quantity}`}
              </p>
            </div>
          </div>
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
        },
      }}
    >
      <DialogTitle id="item-dialog-title" className="text-[#5651e5] relative">
        <div className="text-center font-bold">{item.name}</div>
        <IconButton
          aria-label="close"
          onClick={() => setIsModalOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#5651e5',
          }}
        >
          <FaTimes />
        </IconButton>
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
                    <div className='bg-gray-200 p-2 rounded-2xl mb-2' key={index}>
                      <div className='flex items-center justify-between flex-wrap'>
                        <Link to={`/profile/${res.user_id}`} className='flex'>
                          <div className='flex items-center'>
                            <img 
                              src={res.picture} 
                              className={`w-5 h-5 mr-3 overflow-hidden rounded-full ${res.pro && "ring-[#5651e5] ring-2 "}`}
                            />
                          </div>
                          <div className='flex items-center'>
                            {res.user_displayname}
                            {res.pro && (
                                <span className='pro-badge' style={{verticalAlign: 'middle'}}>PRO</span>
                            )}
                          </div>
                        </Link>
                        <Typography>
                          Quantity: {res.quantity}
                        </Typography>
                      </div>
                      <Typography>
                        {res.note}
                      </Typography>
                    </div>
                ))}
              </div>
            )}
            { !blind && (
              <div className="space-y-2 flex flex-col items-center">
                <p className="text-md font-medium text-[#5651e5]">Your Reservation</p>
                <div className="flex items-center space-x-2">
                  <Button onClick={decrementReserve}>
                    <FaMinus className="h-4 w-4 text-[#5651e5]" />
                  </Button>
                  <TextField
                    value={tempUserReservation}
                    onChange={(e) => handleReserveQuantity(e)}
                    className="w-20 text-center"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                              borderColor: '#a5a2f3',
                          },
                          '&:hover fieldset': {
                              borderColor: '#8d8aee',
                          },
                      },
                    }}
                  />
                  <Button onClick={incrementReserve}>
                    <FaPlus className="h-4 w-4 text-[#5651e5]" />
                  </Button>
                </div>
                

                <p className="text-md font-medium text-[#5651e5] mb-0">Purchased</p>
                  <Checkbox 
                    size='large'
                    checked={purchased}
                    onChange={() => setPurchased(!purchased)}
                    sx={{
                      marginTop: -1,
                      color: "#5651e5",
                      '&.Mui-checked': {
                        color: "#5651e5",
                      },
                    }}
                  />
                
                <TextField
                sx={{
                  width:'100%',
                  '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                          borderColor: '#a5a2f3',
                      },
                      '&:hover fieldset': {
                          borderColor: '#8d8aee',
                      },
                  },
                }}
                  multiline
                  value={reserveNote}
                  label="Leave a comment"
                  onChange={(e) => setReserveNote(e.target.value)}
                />
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row w-full gap-2">
              {item.url && (
                <Button
                  fullWidth 
                  className="!text-[#5651e5] !rounded-[25px]" 
                  sx={{
                    border: '2px solid #5651e5', 
                    '&:hover': { background: '#EDEDFF' },
                    padding: '8px 16px'
                  }}
                  onClick={() => window.open(item.url, '_blank')}
                >
                  View Item <FaExternalLinkAlt className="ml-2 h-4 w-4" />
                </Button>
              )}
              
              {!blind && (
                <Button
                  fullWidth 
                  className="!rounded-[25px] bg-gradient-to-r from-[#8d8aee] to-[#5651e5] !text-white hover:from-[#5651e5] hover:to-[#343188]"
                  sx={{
                    padding: '8px 16px'
                  }}
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