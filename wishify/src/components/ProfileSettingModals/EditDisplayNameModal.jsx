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
    border: 'none',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant='h6'>Edit Display Name</Typography>

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
            sx={{mb: 2}}
          />

          <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button
              variant="contained"
              type="submit"
              sx={{ mr: 1 }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={handleClose}
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