import React from 'react';
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
const CreateWishlist = () => {
    return(
        <CreateWishlistButton>Create a Wishlist</CreateWishlistButton>
    )
}

export default CreateWishlist