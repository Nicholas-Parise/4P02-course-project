import React from 'react'
import Navbar from '../components/Navbarmain.jsx'
import '../home.css'
import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom';
import {WishlistThumbnail} from '../components/Thumbnail'
import {EventThumbnail} from '../components/Thumbnail'

const WishlistContainer = styled.div`
      display: flex;
      gap: 3vw;
      margin: 3vw;
      flex-wrap: wrap;
    `
const CreateWishlistButton = styled.button`
    background: #63d471;
    border-radius: 25px;
    padding: 20px;
    width: 200px;
    height: 200px;
    @media screen and (max-width: 440px){
        width: 150px;
        height: 150px;
    }
    &:hover {
        transform: scale(1.05);
        cursor: pointer;
    }
`
const EventContainer = styled.div`
  display: flex;
  gap: 3vw;
  margin: 3vw;
  flex-wrap: wrap;
`
const CreateEventButton = styled.button`
    background: #63d471;
    border-radius: 25px;
    padding: 20px;
    width: 200px;
    height: 200px;
    @media screen and (max-width: 440px){
        width: 150px;
        height: 150px;
    }
    &:hover {
        transform: scale(1.05);
        cursor: pointer;
    }
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
            <NavLink to="/wishlists">
              <CreateWishlistButton> Create a Wishlist </CreateWishlistButton>
            </NavLink>
          </WishlistContainer>
        </div>

        <br/>

        <h1>Events</h1>
        <div className="home-wishlist-top">
          <EventContainer>
            <EventThumbnail title={"Event 1"} role={"contributor"} owner={"John Doe"}></EventThumbnail>
            <EventThumbnail title={"Event 2"} role={"contributor"} owner={"John Doe"}></EventThumbnail>
            <EventThumbnail title={"Event 3"} role={"contributor"} owner={"John Doe"}></EventThumbnail>
            <NavLink to="/events">
              <CreateEventButton> Create an Event </CreateEventButton>
            </NavLink>
          </EventContainer>
        </div>
      </section>
    </>
  )
}

export default Home