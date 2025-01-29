import React from 'react'
import styled from 'styled-components'
import CreateWishlist from '../components/CreateWishlist'
import WishlistThumbnail from '../components/WishlistThumbnail'

const WishlistContainer = styled.div`
  display: flex;
  gap: 3vw;
  margin: 3vw;
  flex-wrap: wrap;
`

const Wishlists = () => {
  return (
    <>
      <h1>My Wishlists</h1>
      <WishlistContainer>
        <CreateWishlist></CreateWishlist>
        <WishlistThumbnail title="Wishlist A"></WishlistThumbnail>
        <WishlistThumbnail title="Wishlist B"></WishlistThumbnail>
      </WishlistContainer>
    </>
  )
}

export default Wishlists