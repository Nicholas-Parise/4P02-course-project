import React, {useState, useEffect} from 'react'
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
    background: linear-gradient(to right, #8d8aee, #5651e5);
    color: white;
    border-radius: 25px;
    padding: 20px;
    width: 200px;
    height: 200px;
    transition: background 0.3s;
    @media screen and (max-width: 440px){
        width: 150px;
        height: 150px;
    }
    &:hover {
        background: linear-gradient(to right, #5651e5, #343188);
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
    background: linear-gradient(to right, #8d8aee, #5651e5);
    color: white;
    border-radius: 25px;
    padding: 20px;
    width: 200px;
    height: 200px;
    transition: background 0.3s;
    @media screen and (max-width: 440px){
        width: 150px;
        height: 150px;
    }
    &:hover {
        background: linear-gradient(to right, #5651e5, #343188);
        transform: scale(1.05);
        cursor: pointer;
    }
`

const ContributionContainer = styled.div`
  display: grid;
  margin: 3vw;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  @media screen and (max-width: 768px){
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 440px){
    grid-template-columns: repeat(2, 1fr);
  }
`

const ItemDisplay = ({ item }) => {
  let item_name = "Temporarily Unavailable" // will be replaced with item.name when backend is ready
  let wishlist_id = "562" // will be replaced with item.wishlist_id when backend is ready

  return (
    <div className="p-1 border rounded-lg shadow-lg max-w-sm bg-white">
      <h2 className="text-xl font-bold mb-2">Wishlist Title</h2>
      <ul className="list-disc list-inside text-base">
        <li><strong>Item:</strong> <a href={`/wishlists/${wishlist_id}#${item.item_id}`}>{item_name}</a></li>
        <li><strong>Note:</strong> {item.note? item.note: <span className='text-red-400'>None</span>}</li>
        <li><strong>Quantity:</strong> {item.quantity}</li>
        <li><strong>Purchased:</strong> {item.purchased ? "Yes" : "No"}</li>
        <li><strong>Created:</strong> {new Date(item.datecreated).toLocaleString()}</li>
        <li><strong>Updated:</strong> {item.dateupdated ? new Date(item.dateupdated).toLocaleString() : "Not Updated"}</li>
      </ul>
    </div>
  );
};


const Home = () => {
  // all the get requests to the backend should be done here
  const [contributions, setContributions] = useState([])

  const backendLoading = () => {
    let url = `https://api.wishify.ca/contributions`
    useEffect(() => {
      let token = localStorage.getItem('token') || ''
      fetch(url, {
          method: 'get',
          headers: new Headers({
            'Authorization': "Bearer "+token
          })
        })
          .then((response) => response.json())
          .then((data) => {
            let newContributions = data;
            newContributions.sort((a, b) => b.wishlist_id - new Date(a.wishlist_id));
            setContributions(newContributions);
            console.log(data);
          })
          .catch((error) => {
            console.log(error)
          })
    }, [])
  }

  const [wishlists, setWishlists] = useState([])

  const wishlistLoading = () => {
    const wishlistUrl = `https://api.wishify.ca/wishlists/`

    useEffect(() => {
      let token = localStorage.getItem('token') || ''
      console.log(token)
      fetch(wishlistUrl, {
          method: 'get',
          headers: new Headers({
            'Authorization': "Bearer "+token
          })
        })
          .then((response) => response.json())
          .then((data) => {
            setWishlists(data);
            console.log(wishlists);
            console.log(data);
          })
          .catch((error) => {
            console.log(error)
          })
    }, [])
  }

  const [eventList, setEventList] = useState([])

  const eventListLoading = () => {
    const eventListURL = `https://api.wishify.ca/events`

    useEffect(() => {
      let token = localStorage.getItem('token') || ''
      console.log(token)
      fetch(eventListURL, {
          method: 'get',
          headers: new Headers({
            'Authorization': "Bearer "+token
          })
        })
          .then((response) => response.json())
          .then((data) => {
            setEventList(data);
            console.log(eventList);
            console.log(data);
          })
          .catch((error) => {
            console.log(error)
          })
    }, [])
  }

  const [user, setUser] = React.useState({
      email: '',
      displayName: '',
      bio: '',
      picture: '',
      likes: []
    })

  const userLoading = () => {
    const userURL = `https://api.wishify.ca/users`

    useEffect(() => {
      let token = localStorage.getItem('token') || ''
      console.log(token)
      fetch(userURL, {
          method: 'get',
          headers: new Headers({
            'Authorization': "Bearer "+token
          })
        })
          .then((response) => response.json())
          .then((data) => {
            setUser({
              email: data.user.email,
              displayName: data.user.displayname,
              bio: data.user.bio === null ? '' : data.user.bio,
              picture: data.user.picture,
              likes: data.categories
            })
            console.log(user);
            console.log(data);
          })
          .catch((error) => {
            console.log(error)
          })
    }, [])
  }
      

  backendLoading()
  wishlistLoading()
  eventListLoading()
  userLoading()

  return (
    <>
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
          <NavLink to="/wishlists">
              <CreateWishlistButton> Create a Wishlist </CreateWishlistButton>
            </NavLink>

            {wishlists.map((wishlist, index) => (
              <WishlistThumbnail 
                //active={''}
                key={index}
                id={wishlist.id}
                title={wishlist.name}
                owner={user.displayName}
                role={"contributor"}
              />
            ))}
          </WishlistContainer>
        </div>

        <br/>

        <h1>Events</h1>
        <div className="home-wishlist-top">
          <EventContainer>
          <NavLink to="/events">
              <CreateEventButton> Create an Event </CreateEventButton>
            </NavLink>
            {eventList.map((event, index) => (
              <WishlistThumbnail 
                //active={''}
                key={index}
                id={event.id}
                title={event.name}
                owner={user.displayName}
                role={"contributor"}
              />
            ))}
          </EventContainer>
        </div>

        <br/>

        <h1>Contributions</h1>
        <div className="home-wishlist-top">
          <ContributionContainer>
            {contributions.map((contribution) => (
              <ItemDisplay key={contribution.id} item={contribution} />
            ))}
          </ContributionContainer>
        </div>
      </section>
    </>
  )
}

export default Home