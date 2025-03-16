import React, { Children } from 'react';
import styled from "@emotion/styled";


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
