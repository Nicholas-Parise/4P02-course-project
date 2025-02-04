import React, {act, useState} from 'react'
import styled from 'styled-components'
import {CreateWishlist} from '../components/CreateButton'
import {WishlistThumbnail} from '../components/Thumbnail'

const WishlistContainer = styled.div`
  display: flex;
  gap: 3vw;
  margin: 3vw;
  flex-wrap: wrap;
`

const Wishlists = () => {
  const [wishlistCount, setWishlistCount] = useState(0);

  const [activeOverlay, toggleActiveOverlay] = useState(undefined);

  const addThumbnailFunc = (e) => {
    setWishlistCount(prevCount => prevCount + 1);
  }

  const changeActiveOverlay = (title) => {
    if(activeOverlay == title){
      alert("Opened " + title)
    } else{
      toggleActiveOverlay(title);
    }
  }

  return (
    <>
      <h1>My Wishlists</h1>
      <WishlistContainer value={activeOverlay}>
        <CreateWishlist addThumbnail={addThumbnailFunc}>Create a Wishlist</CreateWishlist>
        {Array.from({ length: wishlistCount }, (_, index) => (
          <WishlistThumbnail active={activeOverlay} toggleActive={() => changeActiveOverlay("Wishlist " + (parseInt(index)+1))} key={index} title={"Wishlist " + (parseInt(index)+1)}></WishlistThumbnail>
        ))}
      </WishlistContainer>
      <h1>Shared Wishlists</h1>
      <WishlistContainer>
        <WishlistThumbnail title={"Birthday Blam's Birthday Bash (can view only)"} role={"viewer"}></WishlistThumbnail>
        <WishlistThumbnail title={"Freddy Fazbear's Funtime Festival (can contribute to)"} role={"contributor"}></WishlistThumbnail>
      </WishlistContainer>
    </>
  )
}

export default Wishlists