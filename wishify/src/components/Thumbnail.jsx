import {React} from 'react';
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import {FaEye, FaPencilAlt, FaKey} from 'react-icons/fa';

const WishlistButton = styled.button`
  background: white;
  border: 2px solid #5651e5;
  border-radius: 25px;
  padding: 20px;
  width: 200px;
  height: 200px;
  color: black;
  font-size: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  @media screen and (max-width: 440px) {
    width: 150px;
    height: 150px;
  }

  &:hover {
    transform: scale(1.05);
    background: #f0f0f0;
    cursor: pointer;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 25px;
    }
  }
`

const WishlistMenu = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 25px;
  border: 2px solid #5651e5;
  width: 200px;
  height: 200px;
  font-size: clamp(0.5em, 0.75em, 1em);
  position: relative;
  padding: 10px;

  @media screen and (max-width: 440px) {
    width: 150px;
    height: 150px;
  }
`

const EventButton = styled.button`
  background: white;
  border: 2px solid #5651e5;
  border-radius: 25px;
  padding: 20px;
  width: 200px;
  height: 200px;
  color: black;
  font-size: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  @media screen and (max-width: 440px) {
    width: 150px;
    height: 150px;
  }

  &:hover {
    transform: scale(1.05);
    background: #f0f0f0;
    cursor: pointer;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 25px;
    }
  }
`

const EventMenu = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 25px;
  border: 2px solid #5651e5;
  width: 200px;
  height: 200px;
  font-size: clamp(0.5em, 0.75em, 1em);
  position: relative;
  padding: 10px;

  @media screen and (max-width: 440px) {
    width: 150px;
    height: 150px;
  }
`

const createStyledIcon = (IconComponent) => styled(IconComponent)`
  position: absolute;
  left: 20px;
  top: 10px;
`;

const OwnerText = styled.p`
  position: absolute;
  right: 20px;
  top: 10px;
  font-size: 12px; 
  margin: 0; 
`;

const Eye = createStyledIcon(FaEye);

const MenuButton = styled.button`
  background: transparent;
  border: none;
  color: black;
  font-size: 1em;
  padding: 10px;
  text-align: center;
  width: 100%;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    cursor: pointer;
  }
`;

export const WishlistThumbnail = (props) => {
  const WishlistOverlayMenu = () => {
    return (
      <WishlistMenu onMouseLeave={props.toggleActive}>
        <p style={{ margin: "4px", textAlign: 'center', fontSize: '0.9em' }}>Owner: {props.owner}</p>
        <p style={{ overflow: 'hidden', fontSize: '1.2em', textAlign: 'center', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
          {props.title}
        </p>
        <MenuButton onClick={openWishlist}>Open</MenuButton>
        <MenuButton onClick={props.edit}>Edit</MenuButton>
        <MenuButton>Share</MenuButton>
      </WishlistMenu>
    );
  };

  let navigate = useNavigate();
  const openWishlist = (e) => {
    let path = "/wishlists/" + props.id;
    navigate(path);
  };

  if (props.role == "contributor") {
    return (
      <WishlistButton onClick={openWishlist}>
        <Eye />
        <OwnerText>Owner: {props.owner}</OwnerText>
        <div style={{ marginTop: '20px', fontSize: '1.2em' }}>{props.title}</div>
      </WishlistButton>
    );
  } else {
    return (
      <>
        {props.active == props.title ? (
          <WishlistOverlayMenu />
        ) : (
          <WishlistButton onMouseEnter={props.toggleActive}>
            <div style={{ marginTop: '20px', fontSize: '1.2em' }}>{props.title}</div>
          </WishlistButton>
        )}
      </>
    );
  }
};

export const EventThumbnail = (props) => {
  const EventOverlayMenu = () => {
    return (
      <EventMenu onMouseLeave={props.toggleActive}>
        <p style={{ margin: "4px", textAlign: 'center', fontSize: '0.9em' }}>Owner: {props.owner}</p>
        <p style={{ overflow: 'hidden', fontSize: '1.2em', textAlign: 'center', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
          {props.title}
        </p>
        <MenuButton onClick={openEvent}>Open</MenuButton>
        <MenuButton>Edit</MenuButton>
        <MenuButton>Share</MenuButton>
      </EventMenu>
    );
  };

  let navigate = useNavigate();
  const openEvent = (e) => {
    let path = "/events/" + props.id;
    navigate(path);
  };

  if (props.role == "contributor") {
    return (
      <EventButton onClick={openEvent}>
        <Eye />
        <OwnerText>Owner: {props.owner}</OwnerText>
        <div style={{ marginTop: '20px', fontSize: '1.2em' }}>{props.title}</div>
      </EventButton>
    );
  } else {
    return (
      <>
        {props.active == props.title ? (
          <EventOverlayMenu />
        ) : (
          <EventButton onMouseEnter={props.toggleActive}>
            <div style={{ marginTop: '20px', fontSize: '1.2em' }}>{props.title}</div>
          </EventButton>
        )}
      </>
    );
  }
};