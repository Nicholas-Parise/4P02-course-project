import { CircularProgress } from "@mui/material"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

interface Props {
    isLoggedIn: boolean
}

const Share = ({ isLoggedIn }: Props)  => {
    const token = localStorage.getItem('token') || ''
    const { share_token } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        if(!share_token) navigate("/wishlists")

        if(isLoggedIn){
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
        else { // not logged in
            // save share token to session storage
            if(share_token) {
                sessionStorage.setItem("share_token", share_token)
                navigate("/login")
            }
            else{
                alert("An error has occured while sharing this wishlist!")
                console.log("Couldn't set share_token")
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