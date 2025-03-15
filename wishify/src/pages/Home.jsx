import React from 'react';
import '../home.css';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { WishlistThumbnail } from '../components/Thumbnail';
import { EventThumbnail } from '../components/Thumbnail';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2vw;
  padding: 2vw;
  height: calc(100vh - 80px); 
`;

const WelcomeContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const WishlistContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2vw;
`;

const EventContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2vw;
`;

const ThumbnailWrapper = styled.div`
  flex: 0 0 auto; // Prevent flex items from shrinking or growing
  width: 200px; // Fixed width for each thumbnail
  height: 200px; // Fixed height for each thumbnail
`;

const CreateButton = styled.button`
  background: transparent;
  border: 2px solid white;
  background: linear-gradient(135deg, #8d8aee, #5651e5);
  border-radius: 25px;
  padding: 20px;
  width: 200px;
  height: 200px;
  color: white;
  font-size: 1.2em;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  @media screen and (max-width: 440px) {
    width: 150px;
    height: 150px;
  }

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #5651e5, #343188);
    color: transparent;

    &::after {
      content: '+';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2em;
      color: white;
    }
  }
`;

const Home = () => {
  const [user, setUser] = React.useState({
    profilePictureURL: '',
    displayName: 'John Doe',
    email: 'johndoe@wishify.com',
  });

  return (
    <PageContainer>
      <WelcomeContainer>
        <div className="home-user-info">
          <div className="home-user-picture">
            <img
              src={
                user.profilePicture ||
                'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1738333167~exp=1738336767~hmac=d1a2645bf22eff4e35bc060e5a7529cb9cbf09696ae232ab6690c137ad06d5e4&w=1060'
              }
              alt="User profile picture"
            />
          </div>

          <div className="home-welcome-text">
            <h2>Welcome back, {user.displayName}!</h2>
          </div>
        </div>
      </WelcomeContainer>

      <WishlistContainer>
        <div style={{ 
          background: '#5651e5', 
          color: 'white', 
          padding: '5px', 
          paddingLeft: '10px', 
          borderRadius: '20px', 
          width: '100%',  
          fontSize: '25px', 
          fontWeight: 'bold' 
        }}>
          Wishlists
        </div>
        <div className="home-wishlist-top">
          <div style={{ display: 'flex', gap: '3vw', padding: '1vw', overflowX: 'auto' }}>
            <ThumbnailWrapper>
              <WishlistThumbnail title={'Wishlist 1'} role={'contributor'} owner={'John Doe'} />
            </ThumbnailWrapper>
            <ThumbnailWrapper>
              <WishlistThumbnail title={'Wishlist 2'} role={'contributor'} owner={'John Doe'} />
            </ThumbnailWrapper>
            <ThumbnailWrapper>
              <WishlistThumbnail title={'Wishlist 3'} role={'contributor'} owner={'John Doe'} />
            </ThumbnailWrapper>
            <ThumbnailWrapper>
              <NavLink to="/wishlists">
                <CreateButton>Create a Wishlist</CreateButton>
              </NavLink>
            </ThumbnailWrapper>
          </div>
        </div>
      </WishlistContainer>

      <EventContainer>
      <div style={{ 
          background: '#5651e5', 
          color: 'white', 
          padding: '5px', 
          paddingLeft: '10px', 
          borderRadius: '20px', 
          width: '100%',  
          fontSize: '25px', 
          fontWeight: 'bold' 
        }}>
          Events
          </div>
        <div className="home-wishlist-top">
          <div style={{ display: 'flex', gap: '3vw', padding: '1vw', overflowX: 'auto' }}>
            <ThumbnailWrapper>
              <EventThumbnail title={'Event 1'} role={'contributor'} owner={'John Doe'} />
            </ThumbnailWrapper>
            <ThumbnailWrapper>
              <EventThumbnail title={'Event 2'} role={'contributor'} owner={'John Doe'} />
            </ThumbnailWrapper>
            <ThumbnailWrapper>
              <EventThumbnail title={'Event 3'} role={'contributor'} owner={'John Doe'} />
            </ThumbnailWrapper>
            <ThumbnailWrapper>
              <NavLink to="/events">
                <CreateButton>Create an Event</CreateButton>
              </NavLink>
            </ThumbnailWrapper>
          </div>
        </div>
      </EventContainer>
    </PageContainer>
  );
};

export default Home;