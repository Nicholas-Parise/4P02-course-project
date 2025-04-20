import { CircularProgress } from "@mui/material"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

interface Props {
    isLoggedIn: boolean,
    type: "wishlist" | "event"
}

const Share = ({ isLoggedIn, type }: Props)  => {
    const token = localStorage.getItem('token') || ''
    const { share_token } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        if (type === "wishlist"){
            if(!share_token) navigate("/wishlists")
        }
        else if (type === "event"){
            if(!share_token) navigate("/events")
        }
        

        if(isLoggedIn){
            if (type === "wishlist"){
                fetch(`https://api.wishify.ca/wishlists/members`, {
                    method: 'post',
                    headers: new Headers({
                    'Authorization': "Bearer "+token,
                    'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify({
                        share_token: share_token,
                        owner: false,
                        blind: false
                    })
                    })
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        navigate(`/wishlists/${data.id}`)
                    })
                    .catch((error) => {
                    console.log("Failed to share wishlist\n" + error)
                    alert("Failed to share wishlist\n" + error)
                    navigate("/wishlists")
                    }
                )
            }
            else if (type === "event"){
                fetch(`https://api.wishify.ca/events/members`, {
                    method: 'post',
                    headers: new Headers({
                    'Authorization': "Bearer "+token,
                    'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify({
                        share_token: share_token,
                        owner: false,
                    })
                    })
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        navigate(`/events/${data.id}`)
                    })
                    .catch((error) => {
                    console.log("Failed to share event\n" + error)
                    alert("Failed to share event\n" + error)
                    navigate("/events")
                    }
                )
            }
        } 
        else { // not logged in
            // save share token to session storage
            if (type === "wishlist"){
                if(share_token) {
                    sessionStorage.setItem("wishlist_share_token", share_token)
                    navigate("/login")
                }
                else{
                    alert("An error has occured while sharing this wishlist!")
                    console.log("Couldn't set wishlist_share_token")
                }
            }
            else if (type === "event"){
                if(share_token) {
                    sessionStorage.setItem("event_share_token", share_token)
                    navigate("/login")
                }
                else{
                    alert("An error has occured while sharing this event!")
                    console.log("Couldn't set event_share_token")
                }
            }
        }
    },[])

    return (
        <section className="flex justify-center">
            <CircularProgress className="mt-10" />
        </section>
    )
}

export default Share