import { FaMapPin, FaShare } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { Event, Wishlist } from "../types/types";
import { Link } from 'react-router-dom';
import { CircularProgress } from "@mui/material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import ShareWishlistModal from "./ShareWishlistModal";

type WishlistHeaderProps = {
  wishlist: Wishlist | undefined
  event: Event | undefined
}

export default function WishlistHeader({ wishlist, event }: WishlistHeaderProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  return (
    <div className="items-center justify-center flex">
      { wishlist ? (
        <div className="bg-white shadow-md rounded-[25px] p-6 border-2 border-[#5651e5] w-full">
          <div className="flex items-center mb-2 ">
            <h1 className="text-3xl font-bold items-center">{wishlist.name}</h1>
            <IconButton sx={{marginLeft: 2 ,":hover":{color:'#5651e5'}}} onClick={() => {setIsShareModalOpen(true)}} className='w-10 h-10'>
              <FaShare className='transition-[1]'/>
            </IconButton>
          </div>
          
          <p className="text-gray-600">{wishlist.description}</p>
          { wishlist.deadline &&
            <p className="text-gray-800">Deadline: {wishlist.deadline}</p>
          }


          {event && 
            <Link className="hover:text-[#5651e5] transition-colors" to={`/events/${event.id}`}>
              <div className="hover:bg-gray-200 bg-gray-100 p-4 rounded-[25px] border-2 border-[#5651e5] mt-4">
                <h2 className="text-xl font-semibold">      
                  {event.name}
                </h2>
                { event.deadline &&
                  <div className="flex items-center text-gray-600 mb-1">
                    <SlCalender className="w-5 h-5 mr-2" />
                    <span>{event.deadline}</span>
                  </div>
                }
                {event.addr && event.city && 
                  <div className="flex items-center text-gray-600">
                    <FaMapPin className="w-5 h-5 mr-2" />
                    <span>{event.addr + ", " + event.city}</span>
                  </div>
                }
              </div>
            </Link>
          }
          { wishlist.share_token && 
            <ShareWishlistModal
              wishlistID={wishlist.id}
              isOwner={wishlist.owner} 
              shareToken={wishlist.share_token} 
              isOpen={isShareModalOpen} 
              setIsOpen={setIsShareModalOpen}/>
          }
        </div>
        )
        :
        <CircularProgress />
      }
    </div>
  )
}

