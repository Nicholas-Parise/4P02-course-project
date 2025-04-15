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
import ShareEventModal from '../components/ShareEventModal'

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
  const userUrl = `https://api.wishify.ca/users/`

  const [token, setToken] = useState<string>(localStorage.getItem('token') || '')
  const [events, setEvents] = useState<Event[]>([])
  const [sharedEvents, setSharedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  // pulling all events from the backend and storing in events state
useEffect(() => {
    const fetchData = async () => {
      setToken(localStorage.getItem('token') || '');
      console.log(token);
  
      try {
        // Fetch user data and events concurrently
        const [userResponse, eventResponse] = await Promise.all([
          fetch(userUrl, {
            method: 'get',
            headers: new Headers({
              'Authorization': "Bearer " + token,
            }),
          }),
          fetch(eventUrl, {
            method: 'get',
            headers: new Headers({
              'Authorization': "Bearer " + token,
            }),
          }),
        ]);
  
        // Parse responses
        const userData = await userResponse.json();
        const eventData = await eventResponse.json();
  
        // Process user data
        const userId = userData.user.id;
        const userPro = userData.user.pro;
  
        // Process event data
        const ownedEvents = eventData.filter(
          (event: Event) => event.creator_id === userId
        );
        const sharedEvents = eventData.filter(
          (event: Event) => event.creator_id !== userId
        );
        setEvents(ownedEvents);
        setSharedEvents(sharedEvents);
  
        console.log("User Data:", userData);
        console.log("Event Data:", eventData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Set loading to false after both requests are complete
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
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

    // create event in the backend
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
          let newEvent: Event = data.event
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
          // update the events state with the new data
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
    // find the event to duplicate
    const eventToDuplicate = events.find(event => event.name === activeOverlay);
    // this condition should never happen but I've left it here just in case
    if (!eventToDuplicate) {
      console.log("Event not found");
      return;
    }
    const eventId = eventToDuplicate.id;
    console.log(eventToDuplicate)

    const url = `https://api.wishify.ca/events/${eventId}/duplicate`
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
          // update the events state with the new data
          let duplicatedEvent: event = structuredClone(eventToDuplicate);
          duplicatedEvent.id = data.event.id;
          duplicatedEvent.name = data.event.name;
          const updatedEvents = [...events, duplicatedEvent];
          setEvents(updatedEvents);
      })
      .catch((error) => {
          console.log(error)
      })
  }*/

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShare = () => {
    if (activeOverlay) {
      setIsShareModalOpen(true);
    }
  };

  const activeEvent = events.find((event) => event.name === activeOverlay);
    

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
              share={handleShare}
              owner={"Me"}
            />
          ))
        }
      </EventContainer>

      {activeEvent  && activeEvent.share_token && (
              <ShareEventModal
              eventID={activeEvent.id}
              shareToken={activeEvent.share_token} 
              isOpen={isShareModalOpen} 
              setIsOpen={setIsShareModalOpen}/>
            )}
      <h1>Shared Events</h1>
      <EventContainer>
        {sharedEvents.map((event, index) => (
          <EventThumbnail 
            active={activeOverlay} 
            toggleActive={() => changeActiveOverlay(event.name)} 
            key={index} 
            id={event.id}
            title={event.name}
            edit={handleEditOpen}
            share={handleShare}
            owner={event.creator_displayname || "None"}
          />
        ))}
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