import React, { Children } from 'react';
import styled from "styled-components";


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
