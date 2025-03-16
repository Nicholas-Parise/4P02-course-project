import React from 'react'
import { Modal, Button, TextField, Typography, Box, Divider } from '@mui/material'

const EditBioModal = ({ open, handleClose, value, onSave }) => {
  const [inputValue, setInputValue] = React.useState(value)

  React.useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleSave = () => {
    onSave(inputValue)
    handleClose()
  }

  const handleCancel = () => {
    setInputValue(value)
    handleClose()
  }

  const modalStyle = {
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
    <Modal open={open} onClose={handleCancel}>
      <Box sx={modalStyle}>
        <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 'bold', color: '#5651e5' }}>
          Edit Biography
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant='body2' mb={2} sx={{ textAlign: 'center' }}>
          Your biography is a short description of yourself that others can see when viewing your profile.
          Let people know a little bit about yourself and what you like!
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <TextField
          label="Update your biography"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          fullWidth
          multiline
          rows={4}
          variant='outlined'
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{ borderRadius: '25px', borderColor: '#5651e5', color: '#5651e5' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(to right, #8d8aee, #5651e5)',
              color: 'white',
              borderRadius: '25px',
              '&:hover': { background: 'linear-gradient(to right, #5651e5, #343188)' }
            }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default EditBioModal