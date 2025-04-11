import React from 'react'
import { Modal, Button, TextField, Typography, Box, Divider } from '@mui/material'

const EditPictureModal = ({ open, handleClose, value, onSave }) => {
  const [inputValue, setInputValue] = React.useState(value)

  React.useEffect(() => {
    if (open) {
      setInputValue('')
    }
  }, [open])

  const handleSave = () => {
    onSave(inputValue)
    handleClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSave()
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
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 'bold', color: '#5651e5' }}>Edit Picture</Typography>

        <Divider sx={{mb: 2}} />

        <Typography variant='body2' mb={2}>
          Choose a profile picture that best represents you! You can upload a picture to your profile by submitting a link to an image.
        </Typography>

        <Divider sx={{mb: 2}} />

        <form onSubmit={handleSubmit}>
          <TextField
            label="Image URL"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
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
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ borderRadius: '25px', borderColor: '#5651e5', color: '#5651e5', ml: '8px' }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

export default EditPictureModal;