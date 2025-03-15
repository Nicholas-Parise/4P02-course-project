import React, { useState } from 'react';
import styled from '@emotion/styled';
import ModalBox from '@mui/material/Box';
import ModalButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import { CreateWishlist } from '../components/CreateButton';
import { WishlistThumbnail } from '../components/Thumbnail';

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

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2vw;
  padding: 2vw;
  height: calc(100vh - 80px); 
`;

const WishlistSection = styled.div`
  flex: 1; // Each section takes equal height
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
`;

const WishlistContainer = styled.div`
  display: flex;
  gap: 3vw;
  padding: 1vw;
  overflow-x: auto; 
  padding-bottom: 1vw; 
`;

const SharedWishlistContainer = styled.div`
  display: flex;
  gap: 3vw;
  padding: 1vw;
  overflow-x: auto; 
  padding-bottom: 1vw; 
`;

const WishlistThumbnailWrapper = styled.div`
  flex: 0 0 auto; 
  width: 200px;
  height: 200px;
`;

const Wishlists = () => {
  const [wishlistTitles, setWishlistTitles] = useState([]);
  const [newWishlistTitle, setNewWishlistTitle] = useState('');
  const [activeOverlay, toggleActiveOverlay] = useState(undefined);
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    setErrorMessage('');
  };
  const [editOpen, setEditOpen] = React.useState(false);
  const handleEditOpen = () => {
    setEditOpen(true);
    setNewWishlistTitle(activeOverlay);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setErrorMessage('');
  };
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateWishlist = () => {
    if (newWishlistTitle.trim() === '') {
      setErrorMessage('Title cannot be empty');
      return;
    }

    let uniqueTitle = newWishlistTitle;
    let counter = 1;

    while (wishlistTitles.includes(uniqueTitle)) {
      uniqueTitle = `${newWishlistTitle} (${counter})`;
      counter++;
    }

    setWishlistTitles([...wishlistTitles, uniqueTitle]);
    handleModalClose();
  };

  const changeActiveOverlay = (title) => {
    if (activeOverlay === title) {
      toggleActiveOverlay(undefined);
    } else {
      toggleActiveOverlay(title);
    }
  };

  const handleRenameWishlist = () => {
    if (newWishlistTitle.trim() === '') {
      setErrorMessage('Title cannot be empty');
      return;
    } else if (wishlistTitles.includes(newWishlistTitle)) {
      setErrorMessage('Title already exists');
      return;
    }
    setWishlistTitles(wishlistTitles.map(title => title === activeOverlay ? newWishlistTitle : title));
    setNewWishlistTitle('');
    handleEditClose();
  };

  const handleDeleteWishlist = () => {
    console.log("behalf");
  };

  return (
    <PageContainer>
      <WishlistSection>
        <div style={{ 
          background: '#FFFFFF', 
          color: 'black', 
          padding: '5px', 
          textAlign: 'center',
          paddingLeft: '10px', 
          borderRadius: '20px', 
          width: '100%',  
          fontSize: '25px', 
          fontWeight: 'bold' 
        }}>
          My Wishlists
        </div>
        <WishlistContainer>
          <WishlistThumbnailWrapper>
            <CreateWishlist addThumbnail={handleModalOpen}>Create a Wishlist</CreateWishlist>
          </WishlistThumbnailWrapper>
          {wishlistTitles.map((title, index) => (
            <WishlistThumbnailWrapper key={index}>
              <WishlistThumbnail
                active={activeOverlay}
                toggleActive={() => changeActiveOverlay(title)}
                title={title}
                edit={handleEditOpen}
                owner={"Me"}
              />
            </WishlistThumbnailWrapper>
          ))}
        </WishlistContainer>
      </WishlistSection>

      <WishlistSection>
        <div style={{ 
          background: '#FFFFFF', 
          color: 'black', 
          padding: '5px', 
          textAlign: 'center',
          paddingLeft: '10px', 
          borderRadius: '20px', 
          width: '100%',  
          fontSize: '25px', 
          fontWeight: 'bold' 
        }}>
          Shared Wishlists
        </div>
        <SharedWishlistContainer>
          <WishlistThumbnailWrapper>
            <WishlistThumbnail
              title={"Birthday Blam's Birthday Bash (can view and contribute)"}
              role={"contributor"}
              owner={"Birthday Blam"}
            />
          </WishlistThumbnailWrapper>
          <WishlistThumbnailWrapper>
            <WishlistThumbnail
              title={"Geoff's Christmas Wishlist"}
              id={1234}
              role={"contributor"}
              owner={"Geoff"}
            />
          </WishlistThumbnailWrapper>
          {/* Add more shared wishlists here if needed */}
        </SharedWishlistContainer>
      </WishlistSection>

      {/* Modal for Creating Wishlists */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <ModalButton style={{ width: "50%" }} onClick={() => console.log("myself")}>For Myself</ModalButton>
            <ModalButton style={{ width: "50%" }} onClick={() => console.log("behalf")}>On Behalf Of Somebody</ModalButton>
          </div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Enter Wishlist Title
          </Typography>
          <TextField
            fullWidth
            value={newWishlistTitle}
            onChange={(e) => setNewWishlistTitle(e.target.value)}
            label="Wishlist Title"
            variant="outlined"
            margin="normal"
            error={!!errorMessage}
            helperText={errorMessage}
          />
          <ModalButton onClick={handleCreateWishlist}>Create</ModalButton>
        </ModalBox>
      </Modal>

      {/* Modal for Editing Wishlists */}
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBox sx={boxStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Wishlist
          </Typography>
          <TextField
            fullWidth
            value={newWishlistTitle}
            onChange={(e) => setNewWishlistTitle(e.target.value)}
            label="New Wishlist Title"
            variant="outlined"
            margin="normal"
            error={!!errorMessage}
            helperText={errorMessage}
          />
          <ModalButton onClick={handleRenameWishlist}>Rename</ModalButton>
          <ModalButton onClick={handleDeleteWishlist}>Delete</ModalButton>
        </ModalBox>
      </Modal>
    </PageContainer>
  );
};

export default Wishlists;