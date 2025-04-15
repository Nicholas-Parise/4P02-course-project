import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { EditText, EditTextarea } from 'react-edit-text';
import { useParams } from 'react-router-dom';
import 'react-edit-text/dist/index.css';
import banner from "../assets/bday-banner.jpg";
import {WishlistThumbnail} from '../components/Thumbnail';
import {CreateWishlist} from '../components/CreateButton';
import ShareWishlistModal from '../components/ShareWishlistModal';

import ModalBox from '@mui/material/Box';
import ModalButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from '@mui/material/Divider';

const EventSection = styled.section`
  margin-top: 20px;
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 20px;
`;
const EventImage = styled.img`
  grid-column: 1 / -1;
  display: block;
  width: 100%;
  object-fit: cover;
`;
const Content = styled.div`
  grid-column: 1 / 2;
`;
const Sidebar = styled.div`
  grid-column: 2 / 3;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const RSVP = styled.button`
  background: rgb(0, 0, 0);
  color: white;
  padding: 10px;
  width: 100%;
  text-align: center;
  &:hover {
    background: #222;
    cursor: pointer;
  }
`;

const WishlistContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 3vw;
  flex-wrap: wrap;
`

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
const Event = () => {
  const { id } = useParams();
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const eventUrl = `https://api.wishify.ca/events/${id}`;
  const [event, setEvent] = useState({
    name: '',
    description: '',
    deadline: '',
    addr: '',
    city: '',
  });
  const [wishlists, setWishlists] = useState([]);
  const [ownedWishlists, setOwnedWishlists] = useState([]);
  const [originalEvent, setOriginalEvent] = useState(null);
  const [saving, setSaving] = useState(false);

  const [activeOverlay, setActiveOverlay] = useState("");
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
  const [errorMessage, setErrorMessage] = useState('');
  const [newWishlistTitle, setNewWishlistTitle] = useState('');
  const wishlistUrl = `https://api.wishify.ca/wishlists/`;

  // Fetch event data on component mount
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
          deadline: eventData.deadline || '',
          addr: eventData.addr || '',
          city: eventData.city || ''
        };
        setEvent(fetchedEvent);
        setOriginalEvent(fetchedEvent);
        setWishlists(data.wishlists || []);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [eventUrl, token]);

  // Fetch wishlists on component mount
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
        setOwnedWishlists(filteredWishlists);
        console.log(ownedWishlists)
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [wishlistUrl, token]);

  // Save event data to the backend
  const saveEvent = async () => {
    if (JSON.stringify(event) !== JSON.stringify(originalEvent)) {
      setSaving(true);
      setTimeout(() => setSaving(false), 1000)
      try {
        await fetch(eventUrl, {
          method: 'PUT',
          headers: new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(event),
        });
        console.log('Event saved:', event);
        setOriginalEvent(event);
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

  const handleChange = (e) => {
    const localDate = new Date(e.target.value);
    setEvent({ ...event, deadline: localDate.toISOString() });
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    const localDateTime = new Date(date);
    if (isNaN(localDateTime)) return "";
    const offset = localDateTime.getTimezoneOffset() * 60000;
    return new Date(localDateTime - offset).toISOString().slice(0, 16);
  };

  const handleCreateWishlist = (e) => {
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
      console.log(id)
  
      // create wishlist in the backend
      fetch(wishlistUrl, {
        method: 'post',
        headers: new Headers({
            'Authorization': "Bearer "+token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            name: uniqueTitle,
            event_id: id,
            description: "",
            image: "", 
        })
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            let newWishlist = 
            {id: data.wishlist.id,
              event_id: id,
              name: uniqueTitle,
              description: "",
              image: ""} // TODO add descriptions
            setWishlists([...wishlists, newWishlist])
        })
        .catch((error) => {
            console.log(error)
        })
  
      handleModalClose();
    }
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
  function handleRemoveWishlist(){
    const wishlistToRemove = wishlists.find(wishlist => wishlist.name === activeOverlay);
    // this condition should never happen but I've left it here just in case
    if (!wishlistToRemove) {
      console.log("Wishlist not found");
      return;
    }
    const wishlistId = wishlistToRemove.id;

    fetch(wishlistUrl + wishlistId, {
      method: 'put',
      headers: new Headers({
        'Authorization': "Bearer "+token,
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
    if (activeOverlay) {
      setIsShareModalOpen(true);
    }
  };

  const handleShareModalClose = () => {
    setIsShareModalOpen(false);
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
        <EventImage src={banner}></EventImage>
        <Content>
          <EditText
            name="name"
            style={{ fontWeight: 'bold' }}
            value={event.name}
            onChange={(e) => setEvent({ ...event, name: e.target.value })}
            onBlur={saveEvent} // Save on blur
          />
          <EditTextarea
            value={event.description}
            onChange={(e) => setEvent({ ...event, description: e.target.value })}
            onBlur={saveEvent} // Save on blur
            style={{
              resize: 'none',
            }}
            rows={12}
          />
        </Content>
        <Sidebar>
          <RSVP>RSVP Now</RSVP>
          <div>
            <p style={{ fontWeight: 'bold' }}>Date:</p>
            <input
              aria-label="Date and time"
              type="datetime-local"
              value={formatDateForInput(event.deadline)}
              onChange={handleChange} // Update event.date on change
              onBlur={saveEvent} // Save on blur
            />
          </div>
          <div>
            <p style={{ fontWeight: 'bold' }}>Address:</p>
            <EditText
              name="address"
              value={event.addr}
              onChange={(e) => setEvent({ ...event, addr: e.target.value })}
              onBlur={saveEvent} // Save on blur
            />
          </div>
          <div>
            <p style={{ fontWeight: 'bold' }}>City:</p>
            <EditText
              name="city"
              value={event.city}
              onChange={(e) => setEvent({ ...event, city: e.target.value })}
              onBlur={saveEvent} // Save on blur
            />
          </div>
        </Sidebar>
        <WishlistContainer>
          <CreateWishlist addThumbnail={handleModalOpen}> Add a Wishlist </CreateWishlist>
          {wishlists.map((wishlist, index) => (
            <WishlistThumbnail 
              active={activeOverlay} 
              toggleActive={() => changeActiveOverlay(wishlist.name)} 
              key={index} 
              id={wishlist.id}
              title={wishlist.name}
              edit={handleEditOpen}
              duplicate={handleDuplicate}
              share={handleShare}
              owner={"Me"}
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
        <ModalBox sx={boxStyle}>
          <form autoComplete="off" onSubmit={handleChooseWishlist}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Choose a Wishlist
            </Typography>
            <FormControl sx={{ width: '25ch' }}>
              <InputLabel sx={{mt: 3}} id="wishlist-select" required>Wishlist</InputLabel>
              <Select 
                sx={{mt: 3}}
                className='space-y-2'
                labelId="wishlist-select" 
                label="Wishlist"
                value={selectedWishlist}
                required
                onChange={(event) => setSelectedWishlist(event.target.value)}
              >
                {ownedWishlists.length > 0 && ownedWishlists.map(wishlist => {
                  return <MenuItem key={wishlist.id} value={wishlist.id}>{wishlist.name}</MenuItem>
                })}
              </Select>
              <ModalButton type="submit">Choose</ModalButton>
            </FormControl>
          </form>
          <Divider sx={{mb: 2, mt:2}}>OR</Divider>
          <form autoComplete="off" onSubmit={handleCreateWishlist}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create a new Wishlist
            </Typography>
            <FormControl sx={{ width: '25ch' }}>
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
        <ModalButton onClick={handleRemoveWishlist}>Remove From Event</ModalButton>
      </ModalBox>
      </Modal>
    </>
  );
};

export default Event;