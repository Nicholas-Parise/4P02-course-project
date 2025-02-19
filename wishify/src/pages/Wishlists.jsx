import React, {useState} from 'react'
import styled from '@emotion/styled'
import ModalBox from '@mui/material/Box';
import ModalButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {CreateWishlist} from '../components/CreateButton'
import {WishlistThumbnail} from '../components/Thumbnail'

const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const WishlistContainer = styled.div`
  display: flex;
  gap: 3vw;
  margin: 3vw;
  flex-wrap: wrap;
`

const Wishlists = () => {
  const [wishlistCount, setWishlistCount] = useState(0);

  const [activeOverlay, toggleActiveOverlay] = useState(undefined);

  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const addThumbnailFunc = (e) => {
    setWishlistCount(prevCount => prevCount + 1);
    handleModalOpen()
  }

  const changeActiveOverlay = (title) => {
    if(activeOverlay == title){
      toggleActiveOverlay(undefined)
    } else{
      toggleActiveOverlay(title)
    }
  }
  function handleMyself(){
    console.log("myself")
  }
  function handleBehalf(){
    console.log("behalf")
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
        <WishlistThumbnail title={"Birthday Blam's Birthday Bash (can view and contribute)"} role={"contributor"}></WishlistThumbnail>
        <WishlistThumbnail title={"Geoff's Christmas Wishlist"} id={1234} role={"contributor"}></WishlistThumbnail>
      </WishlistContainer>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBox sx={boxStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Who is this for?
          </Typography>
          <ModalButton onClick={handleMyself}>For Myself</ModalButton>
          <ModalButton onClick={handleBehalf}>On Behalf Of A Loved One</ModalButton>
        </ModalBox>
      </Modal>
    </>
  )
}

export default Wishlists