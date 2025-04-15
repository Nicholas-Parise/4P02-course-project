import { FormEvent, useState } from "react"
import { Modal, Button, TextField, Typography, Box, Divider } from '@mui/material'

interface Props{
    eventID: number,
    shareToken: string,
    isOpen: boolean,
    setIsOpen: (state: boolean) => void,
}

const ShareEventModal = ({ eventID, shareToken, isOpen, setIsOpen }: Props) => {
    const [inputEmail, setInputEmail] = useState("")
    const token = localStorage.getItem('token') || ''
  
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        fetch(`https://api.wishify.ca/events/share`, {
            method: 'post',
            headers: new Headers({
              'Authorization': "Bearer "+token,
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                event_id: eventID, // change to event_id when Nick pushes backend change
                email: inputEmail,
            })
            })
            .then((response) => {
                return response.json();
            })
            .then(() => {
                //
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              setIsOpen(false)
            })     
    }

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      bgcolor: 'background.paper',
      border: '2px solid #5651e5',
      borderRadius: '25px',
      boxShadow: 24,
      p: 4,
    }
  
    return (
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={style}>
          <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 'bold', color: '#5651e5' }}>Share Event</Typography>
  
          <Divider sx={{mb: 2}} />
  
          <Typography variant='body1' mb={2} className="text-center">
            Share this link with your friends.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
                onClick={() => navigator.clipboard.writeText(`https://wishify.ca/events/share/${shareToken}`)}
                variant="contained"
                type="submit"
                sx={{
                    background: 'linear-gradient(to right, #8d8aee, #5651e5)',
                    color: 'white',
                    borderRadius: '25px',
                    '&:hover': { background: 'linear-gradient(to right, #5651e5, #343188)' }}
                }>
                Copy Link
            </Button>
          </Box>
          
            <Divider sx={{mb: 2, mt:2}}>OR</Divider>

            <Typography variant='body1' mb={2}>
            Enter the email of the person you want to share this event with.
            </Typography>
    
            <form onSubmit={handleSubmit}>
            <TextField
                required
                type="email"
                label="Email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                fullWidth
                variant='outlined'
                sx={{mb: 2}}
            />
    
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                variant="contained"
                type="submit"
                sx={{
                    background: 'linear-gradient(to right, #8d8aee, #5651e5)',
                    color: 'white',
                    borderRadius: '25px',
                    '&:hover': { background: 'linear-gradient(to right, #5651e5, #343188)' }
                }}
                >
                Share
                </Button>
                <Button
                variant="outlined"
                onClick={() => {setIsOpen(false)}}
                sx={{ borderRadius: '25px', borderColor: '#5651e5', color: '#5651e5', ml: '8px' }}
                >
                Close
                </Button>
            </Box>
            </form>
        </Box>
      </Modal>
    )
}

export default ShareEventModal