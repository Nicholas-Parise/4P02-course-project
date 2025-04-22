import { useState, FormEvent } from "react"
import { Dialog, DialogTitle, Box, DialogContent, DialogContentText, Typography, FormControl, Button, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Event } from "../types/types";

import { Dayjs } from "dayjs";

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

interface Props {
    open: boolean, 
    setOpen: (state: boolean)=>void,
    events: Event[],
    setEvents: (state: Event[])=>void,
    token: string,
}

const CreateEventModal = ({ open, setOpen, events, setEvents, token }: Props) => {
  const [newEvent, setNewEvent] = useState<Partial<Event>>({})
  const [date, setDate] = useState<Dayjs | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(pictureGeneric)
  
  const createEvent = (e: FormEvent) => {
    e.preventDefault();
    
    let uniqueTitle = newEvent.name || "";
    let counter = 1;
    if (events != undefined){
      const eventNames = events.map(event => event.name);
      while (eventNames.includes(uniqueTitle)) {
        uniqueTitle = `${newEvent.name} (${counter})`;
        counter++;
      }
    }

    // create event in the backend
    fetch("https://api.wishify.ca/events", {
      method: 'post',
      headers: new Headers({
          'Authorization': "Bearer "+token,
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
          name: newEvent.name,
          eventid: "",
          description: newEvent.description || "",
          image: selectedImage, 
          deadline: date?.toDate()
      })
      })
      .then((response) => response.json())
      .then((data) => {
          let newEvent: Event =  {
            ...data.event,
            owner: true
          }
          setEvents([...events, newEvent])
          setNewEvent({})
      })
      .catch((error) => {
          console.log(error)
      })
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '25px', // Rounded corners
          background: '#FFFFFF', // Background color matching ProfileMenu
          padding: '20px',
          border: '2px solid #5651e5', // Border color
          maxWidth: '900px', // Set max width to 900px
          //width: '100%', // Ensure it takes full width up to the max width
        },
      }}
    >
      <DialogTitle id="item-dialog-title" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#000', fontSize: '24px' }}>
        Create New Event
      </DialogTitle>
      <DialogContent className="sm:max-w-[525px]">
        <DialogContentText id="item-dialog-description" sx={{ color: '#000' }}>
          Enter the details for a new event.
        </DialogContentText>
        <form autoComplete="off" onSubmit={createEvent}>
          <FormControl>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <TextField 
                  label="Event Name" 
                  value={newEvent.name || ""} 
                  onChange={e => setNewEvent({...newEvent, name: e.target.value})}
                  placeholder="Name your event"
                  required
                />
              </div>
              <div className="grid gap-2">
                <TextField
                  label="Event Description" 
                  value={newEvent.description || ""} 
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  multiline
                />
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="grid gap-2">
                  <DateTimePicker
                    label="Due Date"
                    value={date}
                    onChange={(newValue: any) => setDate(newValue)}
                  />
                </div>
              </LocalizationProvider>


              <div className="grid gap-2">
                <Typography id="modal-modal-title">
                  Event Image
                </Typography>
                <div className="grid grid-cols-4 gap-2">
                  {galleryImages.map((image) => (
                    <div
                      key={image.id}
                      className={ `relative cursor-pointer border-2 rounded-md overflow-hidden transition-all 
                          ${selectedImage === image.src ?
                          'border-[6#551e5] ring-2 ring-[#5651e5] ring-opacity-50'
                          :
                          'border-transparent hover:border-muted-foreground'}`
                      }
                      onClick={() => setSelectedImage(image.src)}
                    >
                    { image.id === 2 && (
                        <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-auto aspect-square object-cover object-[-105px]"
                        />
                    )}
                    { image.id === 3 && (
                        <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-auto aspect-square object-cover object-center"
                        />
                    )}
                    { image.id !== 3 && image.id !== 2 && (
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-auto aspect-square object-cover"
                      />
                    )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                type="submit" 
                variant="contained"
                sx={{
                  background: 'linear-gradient(to right, #8d8aee, #5651e5)',
                  color: 'white',
                  borderRadius: '25px',
                  '&:hover': { background: 'linear-gradient(to right, #5651e5, #343188)' }
                }}
              >
                Create Event
              </Button>
              <Button
                variant="outlined"
                onClick={() => {setOpen(false)}}
                sx={{ borderRadius: '25px', borderColor: '#5651e5', color: '#5651e5', ml: '8px' }}
              >
                Close
              </Button>
            </Box>
            
            
          </FormControl>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateEventModal