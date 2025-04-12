import React, {useState, useEffect, FormEvent} from 'react'
import { type Event } from '../types/types'
import {CreateEvent} from '../components/CreateButton'
import {EventThumbnail} from '../components/Thumbnail'
import Loading from '../components/Loading'

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

const EventContainer = styled.div`
  display: flex;
  gap: 3vw;
  margin: 3vw;
  flex-wrap: wrap;
`

const Events = () => {
  const eventUrl = `https://api.wishify.ca/events/`

  const [token, setToken] = useState<string>(localStorage.getItem('token') || '')
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  // pulling all events from the backend and storing in events state
  useEffect(() => {
    setToken(localStorage.getItem('token') || '')
    console.log(token)
    fetch(eventUrl, {
        method: 'get',
        headers: new Headers({
          'Authorization': "Bearer "+token
        })
      })
        .then((response) => response.json())
        .then((data) => {
          setEvents(data);
          console.log(data);
        })
        .catch((error) => {
          //setError(error)
          console.log(error)
        })
        .finally(() => setLoading(false))
  }, [])
  
  const [newEventTitle, setNewEventTitle] = useState('');
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
    setNewEventTitle(activeOverlay);
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

  const handleCreateEvent = (e: FormEvent) => {
    e.preventDefault();
    if (newEventTitle.trim() === '') {
      setErrorMessage('Title cannot be empty');
      return;
    } 
    
    let uniqueTitle = newEventTitle;
    let counter = 1;
    if (events != undefined){
      const eventNames = events.map(event => event.name);
      while (eventNames.includes(uniqueTitle)) {
        uniqueTitle = `${newEventTitle} (${counter})`;
        counter++;
      }
    }

    // create wishlist in the backend
    fetch(eventUrl, {
      method: 'post',
      headers: new Headers({
          'Authorization': "Bearer "+token,
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
          name: uniqueTitle,
          description: "Type your description here",
          image: "", 
          addr: "Type your address here",
          city: "Type your city here",
      })
      })
      .then((response) => response.json())
      .then((data) => {
          let newEvent: Event = 
          {id: data.event.id,
            name: uniqueTitle,
            description: "Type your description here",
            url: "",
            addr: "Type your address here",
            city: "Type your city here",
            deadline: "",
            image: "",
            dateCreated: Date.now().toString(),
            dateUpdated: Date.now().toString()
          }
          setEvents([...events, newEvent])
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
  function handleRenameEvent(){
    const eventNames = events.map(event => event.name);

    if (newEventTitle.trim() === '') {
      setErrorMessage('Title cannot be empty');
      return;
    } else if (eventNames.includes(newEventTitle)) {
      setErrorMessage('Title already exists');
      return;
    }

    const eventToRename = events.find(event => event.name === activeOverlay);
    // this condition should never happen but I've left it here just in case
    if (!eventToRename) {
      console.log("Event not found");
      return;
    }
    const eventId = eventToRename.id;

    console.log("id " + eventId)
    console.log("token " + token)
    console.log("name " + newEventTitle)
    fetch(eventUrl + eventId, {
      method: 'put',
      headers: new Headers({
        'Authorization': "Bearer "+token,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        name: newEventTitle,
      })
      })
      .then((response) => response.json())
      .then((data) => {
          console.log(data)
          // update the wishlists state with the new data
          const updatedEvents = events.map(event =>
            event.id === eventId ? data.event : event
          );
          setEvents(updatedEvents);
      })
      .catch((error) => {
          console.log(error)
      })
    
    setNewEventTitle('');
    handleEditClose();
  }
  function deleteEvent(){
    const eventToDelete = events.find(event => event.name === activeOverlay);
    // this condition should never happen but I've left it here just in case
    if (!eventToDelete) {
      console.log("Event not found");
      return;
    }
    const eventId = eventToDelete.id;

    fetch(eventUrl + eventId, {
      method: 'delete',
      headers: new Headers({
          'Authorization': "Bearer "+token,
          'Content-Type': 'application/json'
      }),
      })
      .then((response) => response.json())
      .then((data) => {
          console.log(data)
          const updatedEvents = events.filter(event =>
            event.id !== eventId);
          setEvents(updatedEvents);
          setActiveOverlay('');
          handleDelConfirmClose();
          handleEditClose();
          handleModalClose();
      })
      .catch((error) => {
          console.log(error)
      })
  }

  /*const handleDuplicate = () => {
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
          duplicatedWishlist.id = data.wishlist.id;
          duplicatedWishlist.name = data.wishlist.name;
          const updatedWishlists = [...wishlists, duplicatedWishlist];
          setWishlists(updatedWishlists);
      })
      .catch((error) => {
          console.log(error)
      })
  }*/
    

  return (
    <section className='bg-white border-2 border-solid border-[#5651e5] rounded-[25px]'>
      <h1>My Events</h1>
      <EventContainer>
        <CreateEvent addThumbnail={handleModalOpen}>Create an Event</CreateEvent>
        {loading ? <Loading /> : 
          events.map((event, index) => (
            <EventThumbnail 
              active={activeOverlay} 
              toggleActive={() => changeActiveOverlay(event.name)} 
              key={index} 
              id={event.id}
              title={event.name}
              edit={handleEditOpen}
              owner={"Me"}
            />
          ))
        }
      </EventContainer>
      <h1>Shared Wishlists</h1>
      <EventContainer>
        <EventThumbnail title={"Birthday Blam's Birthday Bash (can view and contribute)"} role={"contributor"} owner={"Birthday Blam"}></EventThumbnail>
        <EventThumbnail title={"Geoff's Christmas Wishlist"} id={1234} role={"contributor"} owner={"Geoff"}></EventThumbnail>
      </EventContainer>
      {/* Modal for Creating Events */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBox sx={boxStyle}>
          <form autoComplete="off" onSubmit={handleCreateEvent}>
            <FormControl sx={{ width: '25ch' }}>
              <TextField
                fullWidth
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                label="Event Title"
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
            Edit Event
        </Typography>
        <TextField
            fullWidth
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            label="New Event Title"
            variant="outlined"
            margin="normal"
            error={!!errorMessage}
            helperText={errorMessage}
        />
        <ModalButton onClick={handleRenameEvent}>Rename</ModalButton>
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
                <ModalButton color='error' onClick={deleteEvent}>Delete</ModalButton>
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

export default Events