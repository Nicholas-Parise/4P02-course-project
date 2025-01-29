import React from 'react';
import styled from "styled-components";

const WishlistButton = styled.button`
    background: rgb(91, 241, 252);
    border-radius: 25px;
    border-color: black;
    padding: 20px;
    width: 200px;
    height: 200px;
    @media screen and (max-width: 440px){
        width: 150px;
        height: 150px;
    }
`
const WishlistThumbnail = (props) => {
    return(
        <WishlistButton>{props.title}</WishlistButton>
    )
}

export default WishlistThumbnail