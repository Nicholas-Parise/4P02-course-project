import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { EditText, EditTextarea } from 'react-edit-text';
import { useParams } from 'react-router-dom';
import 'react-edit-text/dist/index.css';
import { FaPeopleGroup, FaShare } from 'react-icons/fa6';
import {WishlistThumbnail} from '../components/Thumbnail';
import {CreateWishlist} from '../components/CreateButton';
import ShareWishlistModal from '../components/ShareWishlistModal';
import ShareEventModal from '../components/ShareEventModal';
import EventMemberDialog from '../components/EventMemberDialog';

import { Box, Button, DialogContentText } from '@mui/material';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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

const EventSection = styled.section`
  margin-top: 20px;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
  gap: 20px;
  position: relative;
`;

const EventImage = styled.img`
  grid-column: 1 / 3;
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const FloatingActions = styled.div`
  position: absolute;
  top: 10px;
  right: 60px;
  display: flex;
  gap: 10px;
  z-index: 10;
`;

const Content = styled.div`
  grid-column: 1 / 2;
`;

const DetailsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 10px;
  border-radius: 12px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

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
`;

const DescriptionTextarea = styled(EditTextarea)`
  resize: none;
  height: 100px !important;
  border: 2px solid #5651e5;
  padding: 10px;
  border-radius: 8px;
  font-size: 20px;
  width: 100%;
  
  &:hover {
    border-color: #5651e5;
    outline: none;
  }
`;

const ActionButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #5651e5;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:hover {
    background: #e9e9ff;
  }

  svg {
    color: #5651e5;
  }
`;

const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '25px',
  boxShadow: '0 4px 20px rgba(86, 81, 229, 0.15)',
  border: '2px solid #5651e5',
  p: 4,
  width: '90%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflowY: 'auto'
};

const Event = () => {
  const { id } = useParams();
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const eventUrl = `https://api.wishify.ca/events/${id}`;
  const [event, setEvent] = useState({
    name: '',
    description: '',
    addr: null,
    city: null,
    deadline: "null"
  });
  const [wishlists, setWishlists] = useState([]);
  const [ownedWishlists, setOwnedWishlists] = useState([]);
  const [originalEvent, setOriginalEvent] = useState(null);
  const [eventMembers, setEventMembers] = useState([])
  const [saving, setSaving] = useState(false);
  const [rsvpAlert, setRsvpAlert] = useState(false);
  const [owner, setOwner] = useState(false);

  const [activeOverlay, setActiveOverlay] = useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    setErrorMessage('');
    setNewWishlistTitle('');
    setNewWishlistDescription('');
    setNewWishlistDeadline(null);
    setSelectedImage(null);
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

  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false)

  const editMember = (member) => {
    const index = eventMembers.findIndex(i => i.id === member.id);
    const newArray = [...eventMembers] 
    newArray[index] = member
    setEventMembers(newArray)
  }

  const [errorMessage, setErrorMessage] = useState('');
  const [newWishlistTitle, setNewWishlistTitle] = useState('');
  const [newWishlistDescription, setNewWishlistDescription] = useState('');
  const [newWishlistDeadline, setNewWishlistDeadline] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const wishlistUrl = `https://api.wishify.ca/wishlists/`;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(eventUrl, {
          method: 'GET',
          headers: new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
        });
        const data = await response.json();
        const eventData = data.event
        const fetchedEvent = {
          name: eventData.name || '',
          description: eventData.description || '',
          deadline: eventData.deadline || 'null',
          addr: eventData.addr || null,
          city: eventData.city || null,
          share_token: eventData.share_token || '',
          owner: eventData.owner || false,
          image: eventData.image || '/assets/generic.jpg',
        };
        console.log("Event Data")
        console.log(data)
        setEvent(fetchedEvent);
        setOwner(eventData.owner || false);
        setOriginalEvent(fetchedEvent);
        setWishlists(data.wishlists || []);
        setEventMembers(data.members)
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [eventUrl, token]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(wishlistUrl, {
          method: 'GET',
          headers: new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
        });
        const data = await response.json();
        const filteredWishlists = data.filter(wishlist => wishlist.event_id != id);
        const ownedWishlists = filteredWishlists.filter(wishlist => wishlist.owner);
        setOwnedWishlists(ownedWishlists);
        console.log(ownedWishlists)
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [wishlistUrl, token]);

  const [userID, setUserID] = useState()

  useEffect(() => {
      fetch(`https://api.wishify.ca/auth/me`, {
        method: 'get',
        headers: new Headers({
            'Authorization': "Bearer "+localStorage.getItem("token"),
            'Content-Type': 'application/json'
        }),
      })
        .then((response) => response.json())
        .then((data) => {
            setUserID(data.id)
        })
        .catch((error) => {
            console.log(error)
        })
    }, [])

  const saveEvent = async () => {
    if (JSON.stringify(event) !== JSON.stringify(originalEvent)) {
      setSaving(true);
      setTimeout(() => setSaving(false), 1000)

      const dataToSend = {
        ...event,
        addr: event.addr || null, 
        city: event.city || null,
        deadline: event.deadline === "" ? "null" : event.deadline 
      };

      try {
        const response = await fetch(eventUrl, {
          method: 'PUT',
          headers: new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error(errorData.message || 'Failed to save event');
        }

        const updatedEvent = await response.json();
        console.log('Event saved:', updatedEvent);
        setOriginalEvent(updatedEvent.event || event);
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveEvent, 30000); // Save every 30 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [event, originalEvent, eventUrl, token]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (JSON.stringify(event) !== JSON.stringify(originalEvent)) {
        saveEvent();
        e.preventDefault();
        e.returnValue = ''; // Required for some browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [event, originalEvent]);

  const handleDateChange = (e) => {
    const value = e.target.value;
    const deadlineValue = value ? new Date(value).toISOString() : "null";
    setEvent({ ...event, deadline: deadlineValue });
  };

  const formatDateForInput = (date) => {
    if (!date || date === "null") return "";
    const localDateTime = new Date(date);
    if (isNaN(localDateTime.getTime())) return "";
    const offset = localDateTime.getTimezoneOffset() * 60000;
    return new Date(localDateTime.getTime() - offset).toISOString().slice(0, 16);
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setEvent({ ...event, addr: value || null });
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setEvent({ ...event, city: value || null });
  };

  const handleCreateWishlist = async (e) => {
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

    try {
      const response = await fetch(wishlistUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: uniqueTitle,
          event_id: id,
          description: newWishlistDescription,
          deadline: newWishlistDeadline ? newWishlistDeadline.toISOString() : null,
          image: selectedImage,
        }),
      });
      const data = await response.json();
      const newWishlist = {
        id: data.wishlist.id,
        event_id: id,
        name: uniqueTitle,
        description: newWishlistDescription,
        deadline: newWishlistDeadline,
        image: selectedImage,
      };
      setWishlists([...wishlists, newWishlist]);
      handleModalClose();
    } catch (error) {
      console.error('Error creating wishlist:', error);
    }
  };

  const changeActiveOverlay = (title) => {
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
    if (!wishlistToRename) {
      console.log("Wishlist not found");
      return;
    }
    const wishlistId = wishlistToRename.id;

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

  function handleRemoveWishlist(){
    const wishlistToRemove = wishlists.find(wishlist => wishlist.name === activeOverlay);
    if (!wishlistToRemove) {
      console.log("Wishlist not found");
      return;
    }
    const wishlistId = wishlistToRemove.id;

    fetch(wishlistUrl + wishlistId, {
      method: 'put',
      headers: new Headers({
        'Authorization': "Bearer "+token,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        event_id: "null"
      })
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        setWishlists(wishlists.filter(wishlist => wishlist.id !== wishlistId))
        handleEditClose();
    })
    .catch((error) => {
        console.log(error)
    })
  }

  const handleDuplicate = () => {
    const wishlistToDuplicate = wishlists.find(wishlist => wishlist.name === activeOverlay);
    if (!wishlistToDuplicate) {
      console.log("Wishlist not found");
      return;
    }
    const wishlistId = wishlistToDuplicate.id;

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
        let duplicatedWishlist = structuredClone(wishlistToDuplicate);
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
    console.log(event)
    setIsShareModalOpen(true);
  };

  const handleChooseWishlist = (e) => {
    e.preventDefault();
    if (selectedWishlist) {
      fetch(wishlistUrl + selectedWishlist, {
        method: 'put',
        headers: new Headers({
          'Authorization': "Bearer "+token,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          event_id: Number(id)
        })
      })
      .then((response) => response.json())
      .then((data) => {
          console.log(data)
          setWishlists([...wishlists, data.wishlist])
      })
      .catch((error) => {
          console.log(error)
      })
    }
    setSelectedWishlist('');
    handleModalClose();
  }
    
  const activeWishlist = wishlists.find((wishlist) => wishlist.name === activeOverlay);
  const [selectedWishlist, setSelectedWishlist] = useState('')

  return (
    <>
      <EventSection>
        <EventImage src={event.image} alt="Event banner" />
        
        <FloatingActions>
          <ActionButton onClick={() => setIsMemberDialogOpen(true)}>
            <FaPeopleGroup size={18} />
            <span>View Members</span>
          </ActionButton>
          <ActionButton onClick={handleShare}>
            <FaShare size={18} />
            <span>Share Event</span>
          </ActionButton>
        </FloatingActions>
        
        <Content>
          {event.owner ? (
            <EditText
              name="name"
              style={{ 
                fontSize: '30px',
                fontWeight: 'bold',
                color: '#5651e5',
                padding: '8px 0',
                justifyContent: 'center',
                textAlign: 'center',
              }}
              value={event.name}
              onChange={(e) => setEvent({ ...event, name: e.target.value })}
              onBlur={saveEvent}
            />
          ) : (
            <h1 style={{
              fontSize: '30px',
              fontWeight: 'bold',
              color: '#5651e5',
              padding: '8px 0',
              justifyContent: 'center',
              textAlign: 'center',
            }}>{event.name}</h1>
          )}
          {event.owner ? (        
            <DescriptionTextarea
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
              onBlur={saveEvent}
              rows={4}
            />) : (event.description && (
            <p style={{
              resize: "none",
              marginBottom: "10px",
              height: "100px !important",
              borderRadius: "8px",
              fontSize: "20px",
              width: "100%"
            }}>{event.description}</p>)
          )}
          
          <DetailsContainer>
            {event.owner ? 
              (
              <DetailItem>
                <label style={{ fontWeight: 'bold', color: '#5651e5', marginBottom: '3px'}}>Date</label>
                <input
                  type="datetime-local"
                  value={formatDateForInput(event.deadline)}
                  onChange={handleDateChange}
                  onBlur={saveEvent}
                  style={{
                    width: '100%',
                    height: '60px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '2px solid #5651e5'
                  }}
                />
              </DetailItem>
              ) : ( event.deadline !== "null" && (
                <DetailItem>
                <label style={{ fontWeight: 'bold', color: '#5651e5' }}>Date</label>
                <p style={{
                  resize: "none",
                  marginBottom: "10px",
                  height: "100px !important",
                  borderRadius: "8px",
                  fontSize: "20px",
                  width: "100%"
                }}>{new Date(event.deadline).toLocaleString()}</p>
              </DetailItem>
              ))
            }
            {event.owner ?
              (
              <DetailItem>
                <label style={{ fontWeight: 'bold', color: '#5651e5' }}>Address</label>
                <EditText
                  name="address"
                  value={event.addr || ''}
                  onChange={handleAddressChange}
                  onBlur={saveEvent}
                  label="Enter Address"
                  style={{ 
                    width: '100%', 
                    height: '60px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '2px solid #5651e5'
                  }}
                />
              </DetailItem>
              ) : ( event.addr && (
                <DetailItem>
                <label style={{ fontWeight: 'bold', color: '#5651e5' }}>Address</label>
                <p style={{
                  resize: "none",
                  marginBottom: "10px",
                  height: "100px !important",
                  borderRadius: "8px",
                  fontSize: "20px",
                  width: "100%"
                }}>{event.addr}</p>
              </DetailItem>
              ))
            }      
            {event.owner ?
            (
            <DetailItem>
              <label style={{ fontWeight: 'bold', color: '#5651e5' }}>City</label>
              <EditText
                name="city"
                value={event.city || ''}
                onChange={handleCityChange}
                onBlur={saveEvent}
                label="Enter City"
                style={{ 
                  width: '100%', 
                  height: '60px',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '2px solid #5651e5'
                }}
              />
            </DetailItem>
            ) : ( event.city && (
              <DetailItem>
              <label style={{ fontWeight: 'bold', color: '#5651e5' }}>City</label>
              <p style={{
                resize: "none",
                marginBottom: "10px",
                height: "100px !important",
                borderRadius: "8px",
                fontSize: "20px",
                width: "100%"
              }}>{event.city}</p>
            </DetailItem>
            ))
            }
          </DetailsContainer>
        </Content>
        
        <WishlistContainer>
          <CreateWishlist addThumbnail={handleModalOpen}> 
            Add a Wishlist 
          </CreateWishlist>
          
          {wishlists.map((wishlist, index) => (
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
              owner={wishlist.creator_displayname}
              isOwner={wishlist.owner}
              shareToken={wishlist.share_token}
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
        </EventSection>

        {saving && (
          <p style={{ textAlign: 'center', color: 'green' }}>Saving...</p>
        )}

        <Modal
          open={modalOpen}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={boxStyle}>
            <form autoComplete="off" onSubmit={handleChooseWishlist}>
              <Typography 
                id="modal-modal-title" 
                variant="h6" 
                component="h2"
                sx={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold', 
                  color: '#5651e5',
                  fontSize: '1.5rem',
                  padding: '16px 0',
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                Choose a Wishlist
              </Typography>
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="wishlist-select" required>Wishlist</InputLabel>
                <Select
                  labelId="wishlist-select"
                  label="Wishlist"
                  value={selectedWishlist}
                  required
                  onChange={(event) => setSelectedWishlist(event.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                >
                  {ownedWishlists.length > 0 && ownedWishlists.map(wishlist => (
                    <MenuItem key={wishlist.id} value={wishlist.id}>{wishlist.name}</MenuItem>
                  ))}
                </Select>
                <Button 
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    background: 'linear-gradient(to right, #8d8aee, #5651e5)',
                    color: 'white',
                    borderRadius: '25px',
                    padding: '8px 24px',
                    boxShadow: 'none',
                    '&:hover': { 
                      background: 'linear-gradient(to right, #5651e5, #343188)',
                      boxShadow: 'none'
                    }
                  }}
                >
                  Choose
                </Button>
              </FormControl>
            </form>
            
            <Divider sx={{ my: 3 }}>OR</Divider>
            
            <form autoComplete="off" onSubmit={handleCreateWishlist}>
              <Typography 
                id="modal-modal-title" 
                variant="h6" 
                component="h2"
                sx={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold', 
                  color: '#5651e5',
                  fontSize: '1.5rem',
                  padding: '16px 0',
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                Create New Wishlist
              </Typography>
              
              <DialogContentText 
                sx={{ 
                  color: '#666',
                  textAlign: 'center',
                  marginBottom: '24px',
                  marginTop: '12px'
                }}
              >
                Enter the details for your new wishlist
              </DialogContentText>
              
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  value={newWishlistTitle}
                  onChange={(e) => setNewWishlistTitle(e.target.value)}
                  label="Wishlist Title"
                  variant="outlined"
                  margin="normal"
                  error={!!errorMessage}
                  helperText={errorMessage}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                />
                
                <TextField
                  fullWidth
                  value={newWishlistDescription}
                  onChange={(e) => setNewWishlistDescription(e.target.value)}
                  label="Description (Optional)"
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                />
                
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Due Date (Optional)"
                    value={newWishlistDeadline}
                    onChange={(newValue) => setNewWishlistDeadline(newValue)}
                    slotProps={{
                      textField: {
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          },
                          width: '100%',
                          mt: 2
                        }
                      }
                    }}
                  />
                </LocalizationProvider>

                <Typography 
                  sx={{ 
                    color: '#5651e5',
                    fontWeight: '500',
                    marginBottom: '12px',
                    mt: 2
                  }}
                >
                  Choose a cover image
                </Typography>
                
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  mb: 3
                }}>
                  {galleryImages.map((image) => (
                    <Box
                      key={image.id}
                      sx={{
                        position: 'relative',
                        cursor: 'pointer',
                        border: selectedImage === image.src ? '2px solid #5651e5' : '2px solid transparent',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: '#5651e5'
                        }
                      }}
                      onClick={() => setSelectedImage(image.src)}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        style={{ width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'cover' }}
                      />
                      {selectedImage === image.src && (
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          boxShadow: 'inset 0 0 0 2px #5651e5'
                        }} />
                      )}
                    </Box>
                  ))}
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '16px',
                  marginTop: '24px'
                }}>
                  <Button
                    variant="outlined"
                    onClick={handleModalClose}
                    sx={{ 
                      borderRadius: '25px', 
                      borderColor: '#5651e5', 
                      color: '#5651e5',
                      padding: '8px 24px',
                      '&:hover': {
                        backgroundColor: '#f0f0ff',
                        borderColor: '#5651e5'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(to right, #8d8aee, #5651e5)',
                      color: 'white',
                      borderRadius: '25px',
                      padding: '8px 24px',
                      boxShadow: 'none',
                      '&:hover': { 
                        background: 'linear-gradient(to right, #5651e5, #343188)',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    Create Wishlist
                  </Button>
                </Box>
              </FormControl>
            </form>
          </Box>
        </Modal>
        <Modal
            open={editOpen}
            onClose={handleEditClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
          <Box sx={boxStyle}>
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
          <Button 
            onClick={handleRenameWishlist}
            variant="contained"
            sx={{
              background: 'linear-gradient(to right, #8d8aee, #5651e5)',
              color: 'white',
              borderRadius: '12px',
              padding: '8px 24px',
              boxShadow: 'none',
              mt: 2,
              '&:hover': { 
                background: 'linear-gradient(to right, #5651e5, #343188)',
                boxShadow: 'none'
              }
            }}
          >
            Rename
          </Button>
          <Button 
            onClick={handleRemoveWishlist}
            variant="outlined"
            sx={{ 
              borderRadius: '12px', 
              borderColor: '#5651e5', 
              color: '#5651e5',
              padding: '8px 24px',
              mt: 2,
              ml: 2,
              '&:hover': {
                backgroundColor: '#f0f0ff',
                borderColor: '#5651e5'
              }
            }}
          >
            Remove From Event
          </Button>
        </Box>
        </Modal>
        <Alert severity="success" sx={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 900, opacity: rsvpAlert ? 1 : 0, transition: rsvpAlert ? "none" : "opacity 1s ease-out"}}>
          RSVP successfully added.
        </Alert>
        <EventMemberDialog 
          open={isMemberDialogOpen}
          setOpen={setIsMemberDialogOpen}
          members={eventMembers}
          userID={userID || -1}
          isOwner={owner}
          setOwner={setOwner}
          editMember={editMember}
          eventID={parseInt(id)}
          token={token}
        />
        { event.share_token && (
            <ShareEventModal
            eventID={id}
            shareToken={event.share_token} 
            isOpen={isShareModalOpen}
            isOwner={event.owner}
            setIsOpen={setIsShareModalOpen}/>
          )
        }
      </>
    );
  };

export default Event;