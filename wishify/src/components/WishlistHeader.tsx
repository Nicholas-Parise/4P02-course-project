import { FaMapPin } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { Event, Wishlist } from "../types/types";
import { Link } from 'react-router-dom';

type WishlistHeaderProps = {
  wishlist: Wishlist;
  event: Event | null;
};

export default function WishlistHeader({ wishlist, event }: WishlistHeaderProps) {
  return (
    <div className="bg-white shadow-md rounded-[25px] p-6 border-2 border-[#5651e5]">
      <h1 className="text-3xl font-bold mb-2">{wishlist.name}</h1>
      <p className="text-gray-600 mb-4">{wishlist.desc}</p>
      {event && (
        <div className="bg-gray-100 p-4 rounded-[25px] border-2 border-[#5651e5]">
          <h2 className="text-xl font-semibold mb-2">
            <Link to={event.url} className="hover:text-[#5651e5] transition-colors">
              {event.name}
            </Link>
          </h2>
          <div className="flex items-center text-gray-600 mb-1">
            <SlCalender className="w-5 h-5 mr-2" />
            <span>{event.dateCreated}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaMapPin className="w-5 h-5 mr-2" />
            <span>{event.addr + ", " + event.city}</span>
          </div>
        </div>
      )}
    </div>
  );
}