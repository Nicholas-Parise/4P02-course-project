import React, {useState, useEffect, FormEvent} from 'react'
import { type Wishlist } from '../types/types'
import {CreateWishlist} from '../components/CreateButton'
import {WishlistThumbnail} from '../components/Thumbnail'

import styled from '@emotion/styled'
import ModalBox from '@mui/material/Box';
import ModalButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import FormControl from "@mui/material/FormControl";

const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #5651e5',
  borderRadius: "25px",
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
  const wishlistUrl = `https://api.wishify.ca/wishlists/`

  const [token, setToken] = useState<string>(localStorage.getItem('token') || '')
  const [wishlists, setWishlists] = useState<Wishlist[]>([])

  // pulling all wishlists from the backend and storing in wishlists state
  useEffect(() => {
    setToken(localStorage.getItem('token') || '')
    console.log(token)
    fetch(wishlistUrl, {
        method: 'get',
        headers: new Headers({
          'Authorization': "Bearer "+token
        })
      })
        .then((response) => response.json())
        .then((data) => {
          setWishlists(data);
          console.log(wishlists);
          console.log(data);
          //setLoading(false)
        })
        .catch((error) => {
          //setError(error)
          //setLoading(false)
          console.log(error)
        })
        //.finally(() => setLoading(false))
  }, [])
  
  const [newWishlistTitle, setNewWishlistTitle] = useState('');
  const [activeOverlay, setActiveOverlay] = useState<string>("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    setErrorMessage('');
  }
  const [editOpen, setEditOpen] = React.useState(false);
  const handleEditOpen = () => {
    setEditOpen(true);
    setNewWishlistTitle(activeOverlay);
  }
  const handleEditClose = () => {
    setEditOpen(false);
    setErrorMessage('');
    setActiveOverlay('');
  }
  const [delConfirmOpen, setDelConfirmOpen] = React.useState(false);
  const handleDelConfirmOpen = () => {
    setDelConfirmOpen(true);
  }
  const handleDelConfirmClose = () => {
    setDelConfirmOpen(false);
    setDelConfirmation('');
  }
  const [errorMessage, setErrorMessage] = useState('');

  const [delConfirmation, setDelConfirmation] = useState('');

  const handleCreateWishlist = (e: FormEvent) => {
    e.preventDefault();
    if (newWishlistTitle.trim() === '') {
      setErrorMessage('Title cannot be empty');
      return;
    } 
    
    let uniqueTitle = newWishlistTitle;
    let counter = 1;
    if (wishlists != undefined){
      const wishlistNames = wishlists.map(wishlist => wishlist.name);
      while (wishlistNames.includes(uniqueTitle)) {
        uniqueTitle = `${newWishlistTitle} (${counter})`;
        counter++;
      }
    }

    // create wishlist in the backend
    fetch(wishlistUrl, {
      method: 'post',
      headers: new Headers({
          'Authorization': "Bearer "+token,
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
          name: uniqueTitle,
          eventid: "",
          description: "",
          image: "", 
      })
      })
      .then((response) => response.json())
      .then((data) => {
          let newWishlist: Wishlist = 
          {id: data.wishlist_id,
            eventID: 0, // TODO add event support
            name: uniqueTitle,
            desc: "",
            image: ""} // TODO add descriptions
          setWishlists([...wishlists, newWishlist])
      })
      .catch((error) => {
          console.log(error)
      })

    handleModalClose();
  }

  const changeActiveOverlay = (title: string) => {
    if(activeOverlay == title){
      setActiveOverlay("")
    } else{
      setActiveOverlay(title)
    }
  }
  function handleMyself(){
    console.log("myself")
  }
  function handleBehalf(){
    console.log("behalf")
  }
  function handleRenameWishlist(){
    const wishlistNames = wishlists.map(wishlist => wishlist.name);

    if (newWishlistTitle.trim() === '') {
      setErrorMessage('Title cannot be empty');
      return;
    } else if (wishlistNames.includes(newWishlistTitle)) {
      setErrorMessage('Title already exists');
      return;
    }

    const wishlistToRename = wishlists.find(wishlist => wishlist.name === activeOverlay);
    // this condition should never happen but I've left it here just in case
    if (!wishlistToRename) {
      console.log("Wishlist not found");
      return;
    }
    const wishlistId = wishlistToRename.id;

    console.log("id " + wishlistId)
    console.log("token " + token)
    console.log("name " + newWishlistTitle)
    fetch(wishlistUrl + wishlistId, {
      method: 'put',
      headers: new Headers({
        'Authorization': "Bearer "+token,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        name: newWishlistTitle
      })
      })
      .then((response) => response.json())
      .then((data) => {
          console.log(data)
          // update the wishlists state with the new data
          const updatedWishlists = wishlists.map(wishlist =>
            wishlist.id === wishlistId ? data.wishlist : wishlist
          );
          setWishlists(updatedWishlists);
      })
      .catch((error) => {
          console.log(error)
      })
    
    setNewWishlistTitle('');
    handleEditClose();
  }
  function deleteWishlist(){
    const wishlistToDelete = wishlists.find(wishlist => wishlist.name === activeOverlay);
    // this condition should never happen but I've left it here just in case
    if (!wishlistToDelete) {
      console.log("Wishlist not found");
      return;
    }
    const wishlistId = wishlistToDelete.id;

    fetch(wishlistUrl + wishlistId, {
      method: 'delete',
      headers: new Headers({
          'Authorization': "Bearer "+token,
          'Content-Type': 'application/json'
      }),
      })
      .then((response) => response.json())
      .then((data) => {
          console.log(data)
          const updatedWishlists = wishlists.filter(wishlist =>
            wishlist.id !== wishlistId);
          setWishlists(updatedWishlists);
          setActiveOverlay('');
          handleDelConfirmClose();
          handleEditClose();
          handleModalClose();
      })
      .catch((error) => {
          console.log(error)
      })
  }

  const handleDuplicate = () => {
    // find the wishlist to duplicate
    const wishlistToDuplicate = wishlists.find(wishlist => wishlist.name === activeOverlay);
    // this condition should never happen but I've left it here just in case
    if (!wishlistToDuplicate) {
      console.log("Wishlist not found");
      return;
    }
    const wishlistId = wishlistToDuplicate.id;
    console.log(wishlistToDuplicate)

    const url = `https://api.wishify.ca/wishlists/${wishlistId}/duplicate`
    fetch(url, {
      method: 'post',
      headers: new Headers({
        'Authorization': "Bearer "+token,
        'Content-Type': 'application/json'
      }),
      })
      .then((response) => response.json())
      .then((data) => {
          console.log(data)
          // update the wishlists state with the new data
          let duplicatedWishlist: Wishlist = structuredClone(wishlistToDuplicate);
          console.log(wishlistToDuplicate)
          duplicatedWishlist.id = data.wishlist_id;
          duplicatedWishlist.name = wishlistToDuplicate.name + " (Copy)";
          console.log(wishlistToDuplicate)
          const updatedWishlists = [...wishlists, duplicatedWishlist];
          setWishlists(updatedWishlists);
      })
      .catch((error) => {
          console.log(error)
      })
  }
    

  return (
    <section className='bg-white border-2 border-solid border-[#5651e5] rounded-[25px]'>
      <h1>My Wishlists</h1>
      <WishlistContainer>
        <CreateWishlist addThumbnail={handleModalOpen}>Create a Wishlist</CreateWishlist>
        {wishlists.map((wishlist, index) => (
          <WishlistThumbnail 
            active={activeOverlay} 
            toggleActive={() => changeActiveOverlay(wishlist.name)} 
            key={index} 
            id={wishlist.id}
            title={wishlist.name}
            edit={handleEditOpen}
            duplicate={handleDuplicate}
            owner={"Me"}
          />
        ))}
      </WishlistContainer>
      <h1>Shared Wishlists</h1>
      <WishlistContainer>
        <WishlistThumbnail title={"Birthday Blam's Birthday Bash (can view and contribute)"} role={"contributor"} owner={"Birthday Blam"}></WishlistThumbnail>
        <WishlistThumbnail title={"Geoff's Christmas Wishlist"} id={1234} role={"contributor"} owner={"Geoff"}></WishlistThumbnail>
      </WishlistContainer>
      {/* Modal for Creating Wishlists */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBox sx={boxStyle}>
          <form autoComplete="off" onSubmit={handleCreateWishlist}>
            <FormControl sx={{ width: '25ch' }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Who is this for?
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ModalButton style={{width:"50%"}} onClick={handleMyself}>For Myself</ModalButton>
                <ModalButton style={{width:"50%"}} onClick={handleBehalf}>On Behalf Of Somebody</ModalButton>
              </div>
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
              <ModalButton type="submit">Create</ModalButton>
            </FormControl>
          </form>
        </ModalBox>
      </Modal>
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
        <ModalButton onClick={handleDelConfirmOpen}>Delete</ModalButton>
        <Modal
          open={delConfirmOpen}
          onClose={handleDelConfirmClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <ModalBox sx={boxStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to delete {activeOverlay}?
            </Typography>
            <TextField
              fullWidth
              value={delConfirmation}
              onChange={(e) => setDelConfirmation(e.target.value)}
              label={"Type \"" + activeOverlay + "\" here to confirm"}
              variant="outlined"
              margin="normal"
            />
            {delConfirmation == activeOverlay ?
              <div>
                <ModalButton color='error' onClick={deleteWishlist}>Delete</ModalButton>
                <ModalButton style={{float: 'right'}} onClick={handleDelConfirmClose}>Go Back</ModalButton>
              </div>
              :
              <ModalButton style={{float: 'right'}} onClick={handleDelConfirmClose}>Go Back</ModalButton>
            }
          </ModalBox>
        </Modal>
      </ModalBox>
      </Modal>
    </section>
  )
}

export default Wishlists