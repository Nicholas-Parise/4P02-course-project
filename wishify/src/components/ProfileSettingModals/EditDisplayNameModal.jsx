import React from 'react'
import { Modal, Button, TextField, Typography, Box, Divider } from '@mui/material'

const EditDisplayNameModal = ({ open, handleClose, value, onSave }) => {
  const [inputValue, setInputValue] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setInputValue('')
    }
  }, [open])

  const handleSave = () => {
    onSave(inputValue)
    handleClose();
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
        <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 'bold', color: '#5651e5' }}>Edit Display Name</Typography>

        <Divider sx={{mb: 2}} />

        <Typography variant='body1' mb={2}>
          Your current display name is <strong>{value}</strong>
        </Typography>

        <Typography variant='body2' mb={2}>
          Your display name is what other users will see when collaborating on wishlists and events.
        </Typography>

        <Divider sx={{mb: 2}} />

        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter new display name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            fullWidth
            variant='outlined'
            slotProps={{ htmlInput: { maxLength: 30 } }}
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

export default EditDisplayNameModal;