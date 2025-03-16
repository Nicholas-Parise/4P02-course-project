import { useState, useEffect } from 'react';
import { type WishlistItem } from '../types/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, TextField } from '@mui/material';
import { FaExternalLinkAlt, FaMinus, FaPlus } from 'react-icons/fa';

type WishlistItemProps = {
  item: WishlistItem;
  sortBy: 'priority' | 'price' | 'quantity';
  onReserve: (itemId: number, reservation: number, user: string) => void;
};

const WishlistItemEntry = ({ item, sortBy, onReserve }: WishlistItemProps) => {
  const id = item.id;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, animateLayoutChanges: () => false });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isDraggable = sortBy === 'priority';
  const currentUser = 'Current User'; // In a real app, this would come from authentication
  const totalReserved = item.quantitySupplied || 0;
  const userReservation = item.contributions?.find((r) => r.user === currentUser);
  const availableQuantity = item.quantity - totalReserved;

  const reservedBadgeColour = availableQuantity <= 0 ? 'bg-green-600' : 'bg-yellow-500';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reserveQuantity, setReserveQuantity] = useState(0);

  const incrementReserve = () => setReserveQuantity((prev) => Math.min(prev + 1, availableQuantity));
  const decrementReserve = () => setReserveQuantity((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    setReserveQuantity(userReservation?.quantity || 0);
  }, [userReservation]);

  const handleReserve = () => {
    if (reserveQuantity > 0) {
      onReserve(item.id, reserveQuantity, currentUser);
    } else {
      onReserve(item.id, 0, currentUser);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <li
        ref={setNodeRef}
        style={style}
        className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 cursor-pointer rounded-[25px] border-2 border-[#5651e5]"
        onClick={() => setIsModalOpen(true)}
      >
        {isDraggable && (
          <div {...attributes} {...listeners} className="cursor-move" onClick={(e) => e.stopPropagation()}>
            <svg
              {...attributes}
              {...listeners}
              className="w-6 cursor-move touch-none outline-none fill-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M96 32H32C14.3 32 0 46.3 0 64v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32zm0 160H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32zm0 160H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32zM288 32h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32zm0 160h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32zm0 160h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32z" />
            </svg>
          </div>
        )}
        <div className="flex-shrink-0 w-16 h-16 relative">
          <img src={item.image || '/placeholder.svg'} alt={item.name} />
        </div>
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <h3 className="text-2xl font-semibold text-center font-bold">{item.name}</h3>
            {totalReserved > 0 && (
              <div
                className={`${reservedBadgeColour} p-3 flex-shrink-0 h-8 text-xl font-semibold text-white rounded-full flex items-center justify-center`}
              >
                {availableQuantity <= 0 ? 'Fully Reserved' : 'Partially Reserved'}
              </div>
            )}
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
            minWidth: '400px',
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

            <div className="flex justify-center">
              <div className="border-2 border-[#5651e5] rounded-[25px] p-2">
                <img
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-[20px]"
                />
              </div>
            </div>

            <p className="text-gray-700 text-center">{item.description}</p>
            <p className="font-semibold text-[#5651e5] text-center">Price: ${item.price.toFixed(2)}</p>
            <p className="text-gray-600 text-center">
              Quantity: {availableQuantity} available / {item.quantity} total
            </p>

            <div className="space-y-2">
              <p className="text-md font-medium text-[#5651e5]">Your Reservation</p>
              <div className="flex items-center justify-center space-x-2">
                <Button onClick={decrementReserve} className="text-[#5651e5]">
                  <FaMinus className="h-4 w-4 text-[#5651e5]" />
                </Button>
                <TextField value={reserveQuantity} className="w-20 text-center" />
                <Button onClick={incrementReserve} className="text-[#5651e5]">
                  <FaPlus className="h-4 w-4 text-[#5651e5]" />
                </Button>
              </div>
            </div>

            <div className="flex w-full gap-2">
              <Button
                className="w-1/2 bg-gradient-to-r from-[#8d8aee] to-[#5651e5] !text-white hover:from-[#5651e5] hover:to-[#343188]"
                onClick={() => window.open(item.url, '_blank')}
              >
                Purchase <FaExternalLinkAlt className="ml-2 h-4 w-4" />
              </Button>
              <Button
                className="w-1/2 bg-gradient-to-r from-[#8d8aee] to-[#5651e5] !text-white hover:from-[#5651e5] hover:to-[#343188]"
                onClick={handleReserve}
              >
                {userReservation ? 'Update Reservation' : 'Reserve'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WishlistItemEntry;