import { FaMapPin, FaShare, FaPlus } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { Event, Wishlist } from "../types/types";
import { Link } from 'react-router-dom';
import { CircularProgress } from "@mui/material";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import ShareWishlistModal from "./ShareWishlistModal";
import LinkEventModal from "./LinkEventModal";

import { AiOutlineBell, AiFillBell, AiOutlineClose } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlash, faEye, faCrown } from "@fortawesome/free-solid-svg-icons";

type WishlistHeaderProps = {
  wishlist: Wishlist | undefined
  setWishlist: (state: Wishlist) => void,
  event: Event | undefined,
  setEventID: (state: number | undefined) => void,
  owner: boolean,
  blind: boolean,
  notifications: boolean,
  token: string,
  toggleNotifications: () => void,
  unlinkEvent: () => void,
  handleEventRedirect: (eventID: number) => void
}

export default function WishlistHeader({ wishlist, setWishlist, event, setEventID, owner, blind, notifications, toggleNotifications, token, unlinkEvent, handleEventRedirect }: WishlistHeaderProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isLinkEventModalOpen, setIsLinkEventModalOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>([])

  useEffect(()=>{
    console.log(isLinkEventModalOpen)
},[isLinkEventModalOpen])

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
          <div className="hidden md:flex items-center mb-2">
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

          <div className="md:hidden">
            <div className="flex items-center gap-2 mb-2" style={{width: '50px'}}>
              <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faCrown} className="text-lg opacity-[54%]"/>
                {!owner && <FontAwesomeIcon icon={faSlash} />}
              </span>
              <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faEye} className="text-lg opacity-[54%]"/>
                {blind && <FontAwesomeIcon icon={faSlash} />}
              </span>
            </div>

            {/* Title and Action Buttons */}
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold break-words">
                {wishlist.name}
              </h1>
              <div className="flex items-center gap-1">
                <IconButton 
                  sx={{":hover": {color: '#5651e5'}, padding: '8px'}} 
                  onClick={toggleNotifications}
                >
                  {notifications ? (
                    <AiFillBell className="text-lg"/>
                  ) : (
                    <AiOutlineBell className="text-lg"/>
                  )}
                </IconButton>
                <IconButton 
                  sx={{":hover": {color: '#5651e5'}, padding: '8px'}} 
                  onClick={() => setIsShareModalOpen(true)}
                >
                  <FaShare className="text-lg"/>
                </IconButton>
              </div>
            </div>
          </div>
          
          {/* Content - Mobile and Desktop versions */}
          {wishlist.deadline && (
            <>
              {/* Desktop version */}
              <p className="hidden md:block text-gray-800">
                Deadline: {new Date(wishlist.deadline).toLocaleString()}
              </p>
              {/* Mobile version */}
              <p className="md:hidden text-gray-800 text-sm">
                Deadline: {new Date(wishlist.deadline).toLocaleString()}
              </p>
            </>
          )}
          
          {/* Desktop version */}
          <p className="hidden md:block text-gray-600">
            {wishlist.description}
          </p>
          {/* Mobile version */}
          <p className="md:hidden text-gray-600 text-sm break-words">
            {wishlist.description}
          </p>

          {event ? (
            <>
              {/* Desktop version */}
              <div onClick={() => handleEventRedirect(event.id)} className="cursor-pointer hidden md:block hover:text-[#5651e5] transition-colors">
                <div className="hover:bg-gray-200 bg-gray-100 p-4 rounded-[25px] border-2 border-[#5651e5] mt-4">
                  <div className="flex justify-between">
                    <h2 className="text-xl font-semibold">      
                      {event.name}
                    </h2>
                    <IconButton onClick={(e) => (e.stopPropagation(), unlinkEvent())}>
                      <AiOutlineClose size={18} />
                    </IconButton>
                  </div>
                  {event.deadline && (
                    <div className="flex items-center text-gray-600 mb-1">
                      <SlCalender className="w-5 h-5 mr-2" />
                      <span>{new Date(event.deadline).toLocaleString()}</span>
                    </div>
                  )}
                  {event.addr && event.city && (
                    <div className="flex items-center text-gray-600">
                      <FaMapPin className="w-5 h-5 mr-2" />
                      <span>{event.addr + ", " + event.city}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile version */}
              <Link className="md:hidden hover:text-[#5651e5] transition-colors" to={`/events/${event.id}`}>
                <div className="hover:bg-gray-200 bg-gray-100 p-3 rounded-[25px] border-2 border-[#5651e5] mt-4">
                  <h2 className="text-lg font-semibold">      
                    {event.name}
                  </h2>
                  {event.deadline && (
                    <div className="flex items-center text-gray-600 mb-1 text-sm">
                      <SlCalender className="w-4 h-4 mr-2" />
                      <span>{new Date(event.deadline).toLocaleString()}</span>
                    </div>
                  )}
                  {event.addr && event.city && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <FaMapPin className="w-4 h-4 mr-2" />
                      <span>{event.addr + ", " + event.city}</span>
                    </div>
                  )}
                </div>
              </Link>
            </>
          ) : (
            owner && (
              <>
                {/* Desktop version */}
                <button 
                  className="hidden md:flex cursor-pointer w-full items-center hover:bg-gray-200 bg-gray-100 p-4 rounded-[25px] border-2 border-[#5651e5] mt-4 hover:text-[#5651e5] transition-colors"
                  onClick={() => (fetchEvents(), setIsLinkEventModalOpen(true))}
                >
                  <FaPlus fontSize={18} className="mr-2"/> Link Event
                </button>
                
                {/* Mobile version */}
                <button 
                  className="md:hidden cursor-pointer w-full flex items-center hover:bg-gray-200 bg-gray-100 p-3 rounded-[25px] border-2 border-[#5651e5] mt-4 hover:text-[#5651e5] transition-colors text-sm"
                  onClick={() => (fetchEvents(), setIsLinkEventModalOpen(true))}
                >
                  <FaPlus className="mr-2"/> Link Event
                </button>
              </>
            )
          )}

          {/* Modals */}
          {wishlist.share_token && (
            <ShareWishlistModal
              wishlistID={wishlist.id}
              isOwner={wishlist.owner} 
              shareToken={wishlist.share_token} 
              isOpen={isShareModalOpen} 
              setIsOpen={setIsShareModalOpen}
            />
          )}

          {wishlist.owner && (
            <LinkEventModal 
              wishlist={wishlist}
              setWishlist={setWishlist}
              events={events}
              setEventID={setEventID}
              open={isLinkEventModalOpen}
              setOpen={setIsLinkEventModalOpen}
              token={token}
            />
          )}
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  )
}