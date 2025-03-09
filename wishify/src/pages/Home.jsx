import React from 'react'
import Navbar from '../components/Navbarmain.jsx'
import '../home.css'
import styled from '@emotion/styled'
import {CreateWishlist} from '../components/CreateButton'
import {WishlistThumbnail} from '../components/Thumbnail'

const WishlistContainer = styled.div`
      display: flex;
      gap: 3vw;
      margin: 3vw;
      flex-wrap: wrap;
    `

const Home = () => {
  const [user, setUser] = React.useState({
      profilePictureURL: "",
      displayName: "John Doe",
      email: "johndoe@wishify.com",
  })

  return (
    <>
      <Navbar></Navbar>
      <br/>
      <section className="home-container">
        <div className="home-user-info">

          <div className="home-user-picture">
            <img
              src={user.profilePicture || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1738333167~exp=1738336767~hmac=d1a2645bf22eff4e35bc060e5a7529cb9cbf09696ae232ab6690c137ad06d5e4&w=1060"}
              alt='User profile picture'
            />
          </div>

          <div className="home-welcome-text">
            <h2>Welcome back, {user.displayName}!</h2>
          </div>
        </div>

        <br/>

        <h1>Wishlists</h1>
        <div className="home-wishlist-top">
          <WishlistContainer>
            <WishlistThumbnail title={"Wishlist 1"} role={"contributor"} owner={"John Doe"}></WishlistThumbnail>
            <WishlistThumbnail title={"Wishlist 2"} role={"contributor"} owner={"John Doe"}></WishlistThumbnail>
            <WishlistThumbnail title={"Wishlist 3"} role={"contributor"} owner={"John Doe"}></WishlistThumbnail>
          </WishlistContainer>
        </div>
      </section>
    </>
  )
}

export default Home