import React, {useState, useEffect} from 'react'
import '../home.css'
import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom';
import {WishlistThumbnail} from '../components/Thumbnail'
import {EventThumbnail} from '../components/Thumbnail'
import FirstSetupModal from '../components/ProfileSettingModals/FirstSetupModal';
import { useNavigate } from 'react-router-dom';

const WishlistContainer = styled.div`
  display: grid;
  gap: 20px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`
const ViewMoreButton = styled.button`
  background: linear-gradient(to right, #8d8aee, #5651e5);
  color: white;
  border-radius: 25px;
  padding: 15px;
  width: 100%;
  aspect-ratio: 1/1;
  transition: all 0.3s;
  font-size: 1.5rem;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  &:hover {
    background: ${({ isDisabled }) =>
      isDisabled
        ? "linear-gradient(to right, #8d8aee, #5651e5);" // Keep disabled gradient
        : "linear-gradient(to right, #5651e5, #343188)"};
      transform: ${({ isDisabled }) => (isDisabled ? "none" : "scale(1.05)")};
      cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
    padding: 12px;
  }
`
const EventContainer = styled.div`
  display: grid;
  gap: 20px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`
const CreateEventButton = styled.button`
  background: linear-gradient(to right, #8d8aee, #5651e5);
  color: white;
  border-radius: 25px;
  padding: 15px;
  width: 100%;
  aspect-ratio: 1/1;
  transition: all 0.3s;
  font-size: 1.5rem;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  &:hover {
    background: linear-gradient(to right, #5651e5, #343188);
    transform: scale(1.05);
    cursor: pointer;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
    padding: 12px;
  }
`

const ContributionContainer = styled.div`
  display: grid;
  gap: 20px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`

const ContributionCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 2px solid #5651e5;
  padding: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(86, 81, 229, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(86, 81, 229, 0.15);
  }
`

const ContributionHeader = styled.h3`
  color: #5651e5;
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`

const ContributionDetail = styled.div`
  display: flex;
  margin-bottom: 8px;
  font-size: 0.95rem;
`

const DetailLabel = styled.span`
  font-weight: 600;
  color: #5651e5;
  min-width: 80px;
`

const DetailValue = styled.span`
  color: #333;
  flex-grow: 1;
  word-break: break-word;
`

const ContributionLink = styled.a`
  color: #5651e5;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #343188;
    text-decoration: underline;
  }
`

const EmptyNote = styled.span`
  color: #ef4444;
  font-style: italic;
`

const ItemDisplay = ({ item }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/wishlists/${item.wishlists_id}#${item.item_id}`);
  };

  return (
    <ContributionCard 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <ContributionHeader title={item.wishlist_name}>
        {item.wishlist_name}
      </ContributionHeader>
      
      <ContributionDetail>
        <DetailLabel>Item:</DetailLabel>
        <DetailValue>
          {item.name}
        </DetailValue>
      </ContributionDetail>
      
      {item.note &&  
        <ContributionDetail>
          <DetailLabel>Note:</DetailLabel>
          <DetailValue>
            {item.note}
          </DetailValue>
        </ContributionDetail>
      }
      
      <ContributionDetail>
        <DetailLabel>Quantity:</DetailLabel>
        <DetailValue>{item.quantity}</DetailValue>
      </ContributionDetail>
      
      <ContributionDetail>
        <DetailLabel>Status:</DetailLabel>
        <DetailValue>
          <span style={{ color: item.purchased ? '#10b981' : '#ef4444' }}>
            {item.purchased ? 'Purchased' : 'Not Purchased'}
          </span>
        </DetailValue>
      </ContributionDetail>
      
      <ContributionDetail>
        <DetailLabel>Created:</DetailLabel>
        <DetailValue>
          {new Date(item.datecreated).toLocaleDateString()}
        </DetailValue>
      </ContributionDetail>
      
      {item.dateupdated && (
        <ContributionDetail>
          <DetailLabel>Updated:</DetailLabel>
          <DetailValue>
            {new Date(item.dateupdated).toLocaleDateString()}
          </DetailValue>
        </ContributionDetail>
      )}
    </ContributionCard>
  );
};

const Home = () => {

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
        data.sort((a, b) => new Date(b.datecreated) - new Date(a.datecreated))
        data = data.slice(0,3);
        setWishlists(data);
        console.log("Wishlists:")
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
        data.sort((a, b) => new Date(b.datecreated) - new Date(a.datecreated))
        data = data.slice(0,3);
        setEventList(data);
        console.log("Events:")
        console.log(eventList);
        console.log(data);
        })
        .catch((error) => {
          console.log(error)
        })
    }, [])
}

const [contributions, setContributions] = useState([])
  const contributionLoading = () => {
    let token = localStorage.getItem('token') || ''
    useEffect(() => {
      const fetchData = async () => {
        try {
  
          //GET request: Fetch contributions
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
          console.log("wishlists: ")
          console.log(wishlists)
          newContributions = newContributions.map((contribution) => ({
            ...contribution,
            wishlist_name:
              contribution.wishlists_name ||
              wishlists.find((wishlist) => wishlist.id === contribution.wishlists_id)?.name ||
              "Unknown",
          }));
          newContributions = newContributions.sort((a, b) => 
            a.wishlist_name.localeCompare(b.wishlist_name) // Sort alphabetically by wishlist_name
          );
  
          setContributions(newContributions);
          console.log("Processed Contributions:", newContributions);
        } 
        catch (error) {
          console.error("Error in backendLoading:", error);
        }
      };
    fetchData();
    }, [wishlists]);
  };
  
  const [user, setUser] = React.useState({
    email: '',
    displayName: '',
    bio: '',
    picture: '', // This will store the profile image URL
    likes: [],
    setup: false
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
          picture: data.user.picture, // Set the picture from backend
          likes: data.categories,
          setup: data.user.setup
        })
        console.log(user);
        console.log(data);
      })
      .catch((error) => {
        console.log(error)
      })
    }, [])
  }

  wishlistLoading()
  eventListLoading()
  contributionLoading()
  userLoading()

  // CODE FOR FIRST SETUP MODAL
  const updatePicture = (newPicture) => {
    const trimmed = newPicture.split('/uploads')[1];
    const final = '/uploads' + trimmed;
    setUser((prevUser) => ({
      ...prevUser,
      picture: final,
    }))
  }

  const [openFirstSetupModal, setOpenFirstSetupModal] = useState(false)
  useEffect(() => {
    if (user?.setup) {
      setOpenFirstSetupModal(true)
    }
  }, [user])

  const handleCloseFirstSetupModal = () => {
    setOpenFirstSetupModal(false)
    userLoading()
  }
  // END CODE FOR FIRST SETUP MODAL

  return (
    <>
      <section className="home-container">
        <div className="home-user-info">
          <div className="home-user-picture">
              <img
                  src={user.picture || "/assets/placeholder-avatar.png"}
                  alt='User profile picture'
                  className="w-[150px] h-[150px] rounded-full object-cover"
              />
          </div>
  
          <div className="home-welcome-text">
            <h2>Welcome back, {user.displayName}!</h2>
          </div>
        </div>
  
        <h1>Wishlists</h1>
        <WishlistContainer>
          {wishlists.map((wishlist, index) => (
            <WishlistThumbnail 
              key={index}
              id={wishlist.id}
              title={wishlist.name}
              owner={wishlist.creator_displayname || "None"}
              role={"contributor"}
              image={wishlist.image}
            />
          ))}
          <NavLink to="/wishlists">
            <ViewMoreButton>View More...</ViewMoreButton>
          </NavLink>
        </WishlistContainer>
  
        <h1>Events</h1>
        <EventContainer>
          {eventList.map((event, index) => (
            <EventThumbnail 
              key={index}
              id={event.id}
              title={event.name}
              owner={event.creator_displayname || "None"}
              role={"contributor"}
              image={event.image}
            />
          ))}
          <NavLink to="/events">
            <ViewMoreButton>View More...</ViewMoreButton>
          </NavLink>
        </EventContainer>
          
        <h1>Reservations</h1>
        <div className="home-wishlist-top">
          <ContributionContainer>
            {contributions.map((contribution) => (
              <ItemDisplay key={contribution.id} item={contribution} />
            ))}
          </ContributionContainer>
        </div>
      </section>

      <FirstSetupModal
        open={openFirstSetupModal}
        bioValue={user.bio}
        likesValues={user.likes}
        onSavePicture={updatePicture}
        onClose={handleCloseFirstSetupModal}
      />
    </>
  )
}

export default Home