import { FaMapPin, FaShare, FaPlus } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { Event, Wishlist } from "../types/types";
import { Link } from 'react-router-dom';
import { CircularProgress } from "@mui/material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import ShareWishlistModal from "./ShareWishlistModal";
import LinkEventModal from "./LinkEventModal";

import { AiOutlineBell, AiFillBell } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlash, faEye, faCrown } from "@fortawesome/free-solid-svg-icons";

type WishlistHeaderProps = {
  wishlist: Wishlist | undefined
  setWishlist: (state: Wishlist) => void,
  event: Event | undefined,
  setEventID: (state: number) => void,
  owner: boolean,
  blind: boolean,
  notifications: boolean,
  token: string,
  toggleNotifications: () => void
}

export default function WishlistHeader({ wishlist, setWishlist, event, setEventID, owner, blind, notifications, toggleNotifications, token }: WishlistHeaderProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isLinkEventModalOpen, setIsLinkEventModalOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>([])

  const fetchEvents = () => {
    const url = "https://api.wishify.ca/events";

    fetch(url, {
      method: 'get',
      headers: new Headers({
        'Authorization': "Bearer " + token
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.log(error)
      })
  };

  return (
    <div className="items-center justify-center flex">
      { wishlist ? (
        <div className="bg-white shadow-md rounded-[25px] p-6 border-2 border-[#5651e5] w-full">
          <div className="flex items-center mb-2 ">
            <h1 className="text-3xl font-bold items-center">{wishlist.name}</h1>
            <div className="items-center flex justify-between w-full ml-2">
              <div className="flex items-center">
                <div className="w-12">
                  <span className="fa-layers fa-fw">
                    <FontAwesomeIcon icon={faCrown} fontSize={20} className="opacity-[54%]"/>
                    {!owner && <FontAwesomeIcon icon={faSlash} fontSize={24} />}
                  </span>
                </div>
                <div className="w-12">
                  <span className="fa-layers fa-fw">
                    <FontAwesomeIcon icon={faEye} fontSize={20} className="opacity-[54%]"/>
                    {blind && <FontAwesomeIcon icon={faSlash} fontSize={24} />}
                  </span>
                </div>
              </div>
      
              <div>
                <IconButton sx={{marginLeft: 1 ,":hover":{color:'#5651e5'}}} onClick={() => {toggleNotifications()}} className='w-10 h-10'>
                  { notifications ? (
                    <AiFillBell className='transition-[1]'/>
                  )
                  :
                  (
                    <AiOutlineBell className='transition-[1]'/>
                  )
                  }
                  
                </IconButton>
                <IconButton sx={{marginLeft: 1 ,":hover":{color:'#5651e5'}}} onClick={() => {setIsShareModalOpen(true)}} className='w-10 h-10'>
                  <FaShare className='transition-[1]'/>
                </IconButton>
              </div>
            </div>
          </div>
          
          { wishlist.deadline &&
            <p className="text-gray-800">Deadline: {new Date(wishlist.deadline).toLocaleString()}</p>
          }
          <p className="text-gray-600">{wishlist.description}</p>
          


          {event ? (
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
          )
          :
          (<>
            {
              wishlist.owner &&
              <button 
                className="cursor-pointer w-full flex items-center hover:bg-gray-200 bg-gray-100 p-4 rounded-[25px] border-2 border-[#5651e5] mt-4 hover:text-[#5651e5] transition-colors"
                onClick={() => (fetchEvents(), setIsLinkEventModalOpen(true))}
              >
                  <FaPlus fontSize={18} className="mr-2"/> Link Event
              </button>
            }
          </>
          )
          }
          { wishlist.share_token && 
            <ShareWishlistModal
              wishlistID={wishlist.id}
              isOwner={wishlist.owner} 
              shareToken={wishlist.share_token} 
              isOpen={isShareModalOpen} 
              setIsOpen={setIsShareModalOpen}/>
          }

          { wishlist.owner &&
            <LinkEventModal 
              wishlist={wishlist}
              setWishlist={setWishlist}
              events={events}
              setEventID={setEventID}
              open={isLinkEventModalOpen}
              setOpen={setIsLinkEventModalOpen}
              token={token}
            />
          }
          

        </div>
        )
        :
        <CircularProgress />
      }
    </div>
  )
}

