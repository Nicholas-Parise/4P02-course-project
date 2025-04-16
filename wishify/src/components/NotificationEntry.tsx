import { Notification } from "../types/types"
import { AiOutlineClose } from "react-icons/ai";
import { IconButton } from "@mui/material";

interface Props {
  notification: Notification, 
  handleRedirect: (url: string) => void,
  deleteNotification: (id: number) => void
}

const NotificationEntry = ({notification, handleRedirect, deleteNotification} : Props) => {
  return (
    <div 
      onClick={() => handleRedirect(notification.url)} 
      
      className={`notifications-entry ${notification.is_read ? 'bg-[#ffffff]' : 'bg-[#e8e7ff]'}`}
    >
      <div className="flex justify-between items-center">
        <h2>{notification.title}</h2>
        <IconButton onClick={(e) => (e.stopPropagation(), deleteNotification(notification.id))}>
          <AiOutlineClose size={18} />
        </IconButton>
      </div>
      <p>{notification.body}</p>
    </div>
  )
}

export default NotificationEntry