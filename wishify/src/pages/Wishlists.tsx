import React, {useState, useEffect, FormEvent} from 'react'
import { type Wishlist } from '../types/types'
import {CreateWishlist} from '../components/CreateButton'
import {WishlistThumbnail} from '../components/Thumbnail'
import ShareWishlistModal from '../components/ShareWishlistModal'
import Loading from '../components/Loading'

import styled from '@emotion/styled'
import ModalBox from '@mui/material/Box';
import ModalButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import FormControl from "@mui/material/FormControl";
import CreateWishlistModal from '../components/CreateWishlistModal'

import pictureGift from '/assets/gift.jpg';
import pictureSports from '/assets/sports.jpg';
import pictureTech from '/assets/tech.jpg';
import pictureWedding from '/assets/wedding.jpeg';
import pictureHome from '/assets/kitchen.jpg';
import pictureBooks from '/assets/books.jpg';
import pictureTravel from '/assets/travel.jpg';
import pictureHobby from '/assets/hobby.jpg';

// Predefined gallery of images for wishlists
const galleryImages = [
  { id: 1, src: pictureGift, alt: "Holiday Gift Theme" },
  { id: 2, src: pictureWedding, alt: "Wedding Registry Theme" },
  { id: 3, src: pictureSports, alt: "Sports Theme" },
  { id: 4, src: pictureHome, alt: "Home & Kitchen Theme" },
  { id: 5, src: pictureTech, alt: "Tech & Gadgets Theme" },
  { id: 6, src: pictureBooks, alt: "Book Lovers Theme" },
  { id: 7, src: pictureTravel, alt: "Travel & Adventure Theme" },
  { id: 8, src: pictureHobby, alt: "Hobby & Crafts Theme" },
];

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
  display: grid;
  gap: 20px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`

const Wishlists = () => {
  const wishlistUrl = `https://api.wishify.ca/wishlists/`
  const userUrl = `https://api.wishify.ca/users/`

  const [token, setToken] = useState<string>(localStorage.getItem('token') || '')
  const [loading, setLoading] = useState(true)
  
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [sharedWishlists, setSharedWishlists] = useState<Wishlist[]>([])
  const [pro, setPro] = useState<boolean>(false)


  // pulling all wishlists from the backend and storing in wishlists state
  useEffect(() => {
    const fetchData = async () => {
      setToken(localStorage.getItem('token') || '');
      //console.log(token);
  
      try {
        // Fetch user data and wishlists concurrently
        const [userResponse, wishlistResponse] = await Promise.all([
          fetch(userUrl, {
            method: 'get',
            headers: new Headers({
              'Authorization': "Bearer " + token,
            }),
          }),
          fetch(wishlistUrl, {
            method: 'get',
            headers: new Headers({
              'Authorization': "Bearer " + token,
            }),
          }),
        ]);
  
        // Parse responses
        const userData = await userResponse.json();
        const wishlistData = await wishlistResponse.json();
  
        // Process user data
        const userId = userData.user.id;
        const userPro = userData.user.pro;
        setPro(userPro);
  
        // Process wishlist data
        const ownedWishlists = wishlistData.filter(
          (wishlist: Wishlist) => wishlist.creator_id === userId
        );
        const sharedWishlists = wishlistData.filter(
          (wishlist: Wishlist) => wishlist.creator_id !== userId
        );
        setWishlists(ownedWishlists);
        setSharedWishlists(sharedWishlists);
  
        console.log("User Data:", userData);
        console.log("Wishlist Data:", wishlistData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Set loading to false after both requests are complete
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  
  const [newWishlistTitle, setNewWishlistTitle] = useState('');
  const [activeOverlay, setActiveOverlay] = useState<string>("");
  const [createWishlistModalOpen, setCreateWishlistModalOpen] = React.useState(false);
  const handleModalOpen = () => setCreateWishlistModalOpen(true);
  const handleModalClose = () => {
    setCreateWishlistModalOpen(false);
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

  const changeActiveOverlay = (title: string) => {
    if(activeOverlay == title){
      setActiveOverlay("")
    } else{
      setActiveOverlay(title)
    }
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
    //console.log("token " + token)
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

    // if user is not pro redirect to upgrade page
    if (!pro) {
      window.location.href = "/upgrade";
      return;
    }

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
          duplicatedWishlist.id = data.wishlist.id;
          duplicatedWishlist.name = data.wishlist.name;
          const updatedWishlists = [...wishlists, duplicatedWishlist];
          setWishlists(updatedWishlists);
      })
      .catch((error) => {
          console.log(error)
      })
  }

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShare = () => {
    if (activeOverlay) {
      setIsShareModalOpen(true);
    }
  };

  const redirectToUpgrade = () => {
    window.location.href='/upgrade';
  }

  const activeWishlist = wishlists.find((wishlist) => wishlist.name === activeOverlay);

  return (
    <section className='bg-white border-2 border-solid border-[#5651e5] rounded-[25px]' style={{marginTop:'20px', paddingTop:'20px', paddingBottom:'20px'}}>
      <h1>My Wishlists</h1>
      <WishlistContainer>
        { !pro && wishlists.length >= 3 ? 
          <CreateWishlist disabled={true} addThumbnail={redirectToUpgrade}>Upgrade to pro to create more wishlists</CreateWishlist> :
        <CreateWishlist addThumbnail={handleModalOpen}>Create a Wishlist</CreateWishlist>
        }

        {loading ? <Loading/> : wishlists.map((wishlist, index) => (
          <WishlistThumbnail 
            active={activeOverlay} 
            toggleActive={() => changeActiveOverlay(wishlist.name)} 
            key={index} 
            id={wishlist.id}
            title={wishlist.name}
            image={wishlist.image}
            edit={handleEditOpen}
            duplicate={handleDuplicate}
            share={handleShare}
            owner={wishlist.creator_displayname || "None"}
            isOwner = {wishlist.owner}
          />
        ))}
      </WishlistContainer>

      {activeWishlist && activeWishlist.share_token && (
        <ShareWishlistModal
        wishlistID={activeWishlist.id}
        isOwner={activeWishlist.owner} 
        shareToken={activeWishlist.share_token} 
        isOpen={isShareModalOpen} 
        setIsOpen={setIsShareModalOpen}/>
      )}
      <h1>Shared Wishlists</h1>
      <WishlistContainer>
        {sharedWishlists.map((wishlist, index) => (
          <WishlistThumbnail 
            active={activeOverlay} 
            toggleActive={() => changeActiveOverlay(wishlist.name)} 
            key={index} 
            id={wishlist.id}
            title={wishlist.name}
            image={wishlist.image}
            edit={handleEditOpen}
            duplicate={handleDuplicate}
            share={handleShare}
            owner={wishlist.creator_displayname || "None"}
            isOwner = {wishlist.owner}
          />
        ))}
      </WishlistContainer>

      <CreateWishlistModal 
        open={createWishlistModalOpen}
        setOpen={setCreateWishlistModalOpen}
        wishlists={wishlists}
        setWishlists={setWishlists}
        token={token}
      />

      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBox sx={{
          ...boxStyle,
          '& .MuiTypography-h6': {
            color: '#5651e5',
            fontWeight: 'bold',
            marginBottom: '16px'
          }
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Wishlist
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: '#5651e5',
                },
                '&:hover fieldset': {
                  borderColor: '#4540d4',
                },
              },
              marginBottom: '16px'
            }}
          />
          
          {/* Image Gallery Section */}
          <div>
            <Typography 
              sx={{ 
                color: '#5651e5',
                fontWeight: '500',
                marginBottom: '12px'
              }}
            >
              Cover image
            </Typography>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '16px'
            }}>
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    border: activeWishlist?.image === image.src ? '2px solid #5651e5' : '2px solid transparent',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    boxShadow: activeWishlist?.image === image.src ? '0 0 0 2px rgba(86, 81, 229, 0.5)' : 'none',
                    aspectRatio: '1/1'
                  }}
                  onClick={() => {
                    if (!activeWishlist) return;
                    // Update the local state immediately for better UX
                    const updatedWishlists = wishlists.map(wishlist =>
                      wishlist.id === activeWishlist.id ? {...wishlist, image: image.src} : wishlist
                    );
                    setWishlists(updatedWishlists);
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '16px'
          }}>
            <ModalButton 
              onClick={() => {
                // Validate title first
                const wishlistNames = wishlists.map(wishlist => wishlist.name);
                
                if (newWishlistTitle.trim() === '') {
                  setErrorMessage('Title cannot be empty');
                  return;
                } else if (newWishlistTitle !== activeOverlay && wishlistNames.includes(newWishlistTitle)) {
                  setErrorMessage('Title already exists');
                  return;
                }

                // Find the wishlist to update
                const wishlistToUpdate = wishlists.find(wishlist => wishlist.name === activeOverlay);
                if (!wishlistToUpdate) {
                  console.log("Wishlist not found");
                  return;
                }

                // Send update to backend
                fetch(wishlistUrl + wishlistToUpdate.id, {
                  method: 'put',
                  headers: new Headers({
                    'Authorization': "Bearer "+token,
                    'Content-Type': 'application/json'
                  }),
                  body: JSON.stringify({
                    name: newWishlistTitle,
                    image: wishlistToUpdate.image // This will be the updated image from state
                  })
                })
                .then((response) => response.json())
                .then((data) => {
                    const updatedWishlists = wishlists.map(wishlist =>
                      wishlist.id === wishlistToUpdate.id ? data.wishlist : wishlist
                    );
                    setWishlists(updatedWishlists);
                    setNewWishlistTitle('');
                    handleEditClose();
                })
                .catch((error) => {
                    console.log(error)
                });
              }}
              sx={{
                background: 'linear-gradient(to right, #8d8aee, #5651e5)',
                color: 'white',
                borderRadius: '25px',
                width: '48%',
                '&:hover': { 
                  background: 'linear-gradient(to right, #5651e5, #343188)',
                }
              }}
            >
              Save Changes
            </ModalButton>
            <ModalButton 
              onClick={handleDelConfirmOpen}
              sx={{
                border: '2px solid red',
                color: 'red',
                borderRadius: '25px',
                width: '48%',
                '&:hover': {
                  backgroundColor: '#ffe6e6',
                }
              }}
            >
              Delete
            </ModalButton>
          </div>
          
          {/* Delete confirmation modal remains the same */}
          <Modal
            open={delConfirmOpen}
            onClose={handleDelConfirmClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <ModalBox sx={{
              ...boxStyle,
              '& .MuiTypography-h6': {
                color: '#5651e5',
                fontWeight: 'bold',
                marginBottom: '16px'
              }
            }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to delete {activeOverlay}?
              </Typography>
              <TextField
                fullWidth
                value={delConfirmation}
                onChange={(e) => setDelConfirmation(e.target.value)}
                label={`Type "${activeOverlay}" here to confirm`}
                variant="outlined"
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#5651e5',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4540d4',
                    },
                  }
                }}
              />
              {delConfirmation == activeOverlay ?
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  width: '100%',
                  marginTop: '16px'
                }}>
                  <ModalButton 
                    onClick={deleteWishlist}
                    sx={{
                      border: '2px solid red',
                      color: 'red',
                      borderRadius: '25px',
                      width: '48%',
                      '&:hover': {
                        backgroundColor: '#ffe6e6',
                      }
                    }}
                  >
                    Delete
                  </ModalButton>
                  <ModalButton 
                    onClick={handleDelConfirmClose}
                    sx={{
                      background: 'linear-gradient(to right, #8d8aee, #5651e5)',
                      color: 'white',
                      borderRadius: '25px',
                      width: '48%',
                      '&:hover': { 
                        background: 'linear-gradient(to right, #5651e5, #343188)',
                      }
                    }}
                  >
                    Cancel
                  </ModalButton>
                </div>
                :
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  width: '100%',
                  marginTop: '16px'
                }}>
                  <ModalButton 
                    onClick={handleDelConfirmClose}
                    sx={{
                      background: 'linear-gradient(to right, #8d8aee, #5651e5)',
                      color: 'white',
                      borderRadius: '25px',
                      width: '48%',
                      '&:hover': { 
                        background: 'linear-gradient(to right, #5651e5, #343188)',
                      }
                    }}
                  >
                    Cancel
                  </ModalButton>
                </div>
              }
            </ModalBox>
          </Modal>
        </ModalBox>
      </Modal>
      
    </section>
  )
}

export default Wishlists