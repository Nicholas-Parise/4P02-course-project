import React, { Children } from 'react';
import styled from "@emotion/styled";


const CreateWishlistButton = styled.button`
  background: transparent;
  border: 2px solid #5651e5;
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
`

const CreateEventButton = styled.button`
  background: transparent;
  border: 2px solid #5651e5;
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
`

export const CreateWishlist = (props) => {
    return(
        <CreateWishlistButton onClick={props.addThumbnail}>{props.children}</CreateWishlistButton>
    )
}

export const CreateEvent = (props) => {
    return(
        <CreateEventButton onClick={props.addThumbnail}>{props.children}</CreateEventButton>
    )
}
