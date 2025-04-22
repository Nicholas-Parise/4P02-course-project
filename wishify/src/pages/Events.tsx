import React, {useState, useEffect, FormEvent} from 'react'
import { type Event } from '../types/types'
import {CreateEvent} from '../components/CreateButton'
import {EventThumbnail} from '../components/Thumbnail'
import Loading from '../components/Loading'
import CreateEventModal from '../components/CreateEventModal'

import styled from '@emotion/styled'
import ModalBox from '@mui/material/Box';
import ModalButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import FormControl from "@mui/material/FormControl";
import ShareEventModal from '../components/ShareEventModal'

import pictureBirthday from '/assets/bday-banner.jpg';
import pictureWedding from '/assets/wedding.png';
import pictureCamping from '/assets/camping.jpg';
import pictureChristmas from '/assets/christmas.jpg';
import pictureGeneric from '/assets/generic.jpg';

// Predefined gallery of images for events
const galleryImages = [
  { id: 1, src: pictureBirthday, alt: "Birthday theme" },
  { id: 2, src: pictureWedding, alt: "Wedding theme" },
  { id: 3, src: pictureCamping, alt: "Camping theme" },
  { id: 4, src: pictureChristmas, alt: "Holiday theme" },
  { id: 5, src: pictureGeneric, alt: "Generic theme" }
]


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
        ).map((event: { image: any }) => ({
          ...event,
          owner: true,
          image: event.image
        }));

        const sharedEvents = eventData.filter(
          (event: Event) => event.creator_id !== userId
        ).map((event: { image: any }) => ({
          ...event,
          owner: false,
          image: event.image
        }));

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
  const [createEventModalOpen, setCreateEventModalOpen] = React.useState(false);
  const handleModalOpen = () => setCreateEventModalOpen(true);
  const handleModalClose = () => {
    setCreateEventModalOpen(false);
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
    <section className='bg-white border-2 border-solid border-[#5651e5] rounded-[25px]' style={{marginTop:'20px', paddingTop:'20px', paddingBottom:'20px'}}>
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
              image={event.image} // Make sure this is passed
              edit={handleEditOpen}
              share={handleShare}
              owner={event.creator_displayname || "None"}
              isOwner={event.owner}
            />
          ))
        }
      </EventContainer>

      {activeEvent && activeEvent.share_token && (
        <ShareEventModal
          eventID={activeEvent.id}
          shareToken={activeEvent.share_token} 
          isOwner={activeEvent.owner}
          isOpen={isShareModalOpen} 
          setIsOpen={setIsShareModalOpen}
        />
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
            image={event.image}
            edit={handleEditOpen}
            share={handleShare}
            owner={event.creator_displayname || "None"}
            isOwner={event.owner}
          />
        ))}
      </EventContainer>
      {/* Modal for Editing Events */}
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
                    border: activeEvent?.image === image.src ? '2px solid #5651e5' : '2px solid transparent',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    boxShadow: activeEvent?.image === image.src ? '0 0 0 2px rgba(86, 81, 229, 0.5)' : 'none',
                    aspectRatio: '1/1'
                  }}
                  onClick={() => {
                    if (!activeEvent) return;
                    const updatedEvents = events.map(event =>
                      event.id === activeEvent.id ? {...event, image: image.src} : event
                    );
                    setEvents(updatedEvents);
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
              onClick={handleRenameEvent}
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
                    onClick={deleteEvent}
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
      <CreateEventModal 
        open={createEventModalOpen}
        setOpen={setCreateEventModalOpen}
        events={events}
        setEvents={setEvents}
        token={token}
      />
    </section>
  )
}

export default Events