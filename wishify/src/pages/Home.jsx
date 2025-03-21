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
  flex: 1;
  gap: 3vw;
  @media screen and (max-width: 768px){
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 440px){
    grid-template-columns: repeat(2, 1fr);
  }
`

const ItemDisplay = ({ item }) => {

  return (
    <div className="p-1 border rounded-lg shadow-lg bg-white" style={{width: "200px"}}>
      <h2 className="text-xl font-bold mb-2">{item.wishlist_name}</h2>
      <ul className="list-disc list-inside text-base">
        <li><strong>Item:</strong> <a href={`/wishlists/${item.wishlists_id}#${item.item_id}`}>{item.name}</a></li>
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
  const [wishlists, setWishlists] = useState([])
  const [contributions, setContributions] = useState([])

  const backendLoading = () => {
    useEffect(() => {
      const fetchData = async () => {
        try {
          // First GET request: Fetch wishlists
          const wishlistUrl = `https://api.wishify.ca/wishlists`;
          const token = localStorage.getItem('token') || '';
          const wishlistResponse = await fetch(wishlistUrl, {
            method: 'get',
            headers: new Headers({
              'Authorization': "Bearer " + token,
            }),
          });
  
          if (!wishlistResponse.ok) {
            throw new Error(`Error fetching wishlists: ${wishlistResponse.statusText}`);
          }
  
          const wishlistsData = await wishlistResponse.json();
          setWishlists(wishlistsData);
          console.log("Wishlists:", wishlistsData);
  
          // Second GET request: Fetch contributions
          const contributionsUrl = `https://api.wishify.ca/contributions`;
          const contributionsResponse = await fetch(contributionsUrl, {
            method: 'get',
            headers: new Headers({
              'Authorization': "Bearer " + token,
            }),
          });
  
          if (!contributionsResponse.ok) {
            throw new Error(`Error fetching contributions: ${contributionsResponse.statusText}`);
          }
  
          const contributionsData = await contributionsResponse.json();
          console.log("Contributions:", contributionsData);
  
          // Process contributions
          let newContributions = contributionsData;
          newContributions.sort((a, b) => b.wishlist_id - a.wishlist_id);
          newContributions = newContributions.map((contribution) => ({
            ...contribution,
            wishlist_name:
              contribution.wishlist_name ||
              wishlistsData.find((wishlist) => wishlist.id === contribution.wishlists_id)?.name ||
              "Unknown",
          }));
  
          setContributions(newContributions);
          console.log("Processed Contributions:", newContributions);
        } catch (error) {
          console.error("Error in backendLoading:", error);
        }
      };
  
      fetchData();
    }, []);
  };


  const [user, setUser] = React.useState({
      profilePictureURL: "",
      displayName: "John Doe",
      email: "johndoe@wishify.com",
  })

  backendLoading()

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

        <br/>

        <h1>Contributions</h1>
        <div className="home-wishlist-top" w>
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