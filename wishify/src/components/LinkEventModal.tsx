import { Dialog, Button, DialogTitle, FormControl, Select, MenuItem, DialogContent, SelectChangeEvent, InputLabel } from '@mui/material'
import { useState, FormEvent, useEffect } from 'react'
import { Event, Wishlist } from '../types/types'

interface Props{
    wishlist: Wishlist,
    setWishlist: (state: Wishlist) => void,
    events: Event[],
    setEventID: (state: number | undefined) => void,
    open: boolean,
    setOpen: (state: boolean) => void,
    token: string,
}

const LinkEventModal = ({ wishlist, setWishlist, events, setEventID, open, setOpen, token }: Props) => {
    const [selectedEvent, setSelectedEvent] = useState<string>('')

    const linkEvent = (e: FormEvent) => {
        e.preventDefault();

        const url = `https://api.wishify.ca/wishlists/${wishlist.id}`

        fetch(url, {
        method: 'put',
        headers: new Headers({
            'Authorization': "Bearer "+token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            event_id: Number(selectedEvent)
        })
        })
        .then((response) => response.json())
        .then((data) => {
            setWishlist({...wishlist, ...data.wishlist})
            setSelectedEvent('')
            setEventID(Number(selectedEvent))
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #5651e5',
        borderRadius: '25px',
        boxShadow: 24,
        p: 4,
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
            Link Event
        </DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
            <form autoComplete="off" onSubmit={(e) => (linkEvent(e), setOpen(false))}>
                <FormControl sx={{ width: '25ch' }}>
                    <InputLabel sx={{mt: 1}} id="event-select" required>Event</InputLabel>
                    <Select 
                    sx={{mt: 1}}
                    className='space-y-2' 
                    labelId="event-select"
                    label="Event"
                    value={selectedEvent}
                    required
                    onChange={(event: SelectChangeEvent) => setSelectedEvent(event.target.value)}
                    >
                    {events.length > 0 && events.map(event => {
                        return <MenuItem key={event.id} value={event.id}>{event.name}</MenuItem>
                    })}
                    </Select>

                    <Button 
                        sx={{
                            mt: 3,
                            background: 'linear-gradient(to right, #8d8aee, #5651e5)',
                            color: 'white',
                            borderRadius: '25px',
                            '&:hover': { background: 'linear-gradient(to right, #5651e5, #343188)' }
                        }} 
                        type="submit" 
                        variant="contained"
                    >
                        Link
                    </Button>

                </FormControl>
            </form>

        </DialogContent>
    
    </Dialog>
  )
}

export default LinkEventModal