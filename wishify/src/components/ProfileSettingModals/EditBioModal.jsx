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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: 'background.paper',
    border: '2px solid #5651e5',
    borderRadius: '25px',
    boxShadow: 24,
    p: 4,
  }

  return (
    <Modal open={open} onClose={handleCancel}>
      <Box sx={style}>
        <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 'bold', color: '#5651e5' }}>Edit Biography</Typography>

        <Divider sx={{mb: 2}} />

        <Typography variant='body2' mb={2}>
          Your biography is a short description of yourself that other users can see when viewing your profile. Let people know a little bit about yourself and what you like!
        </Typography>

        <Divider sx={{mb: 2}} />

        <TextField
          label="Update your biography"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          fullWidth
          multiline
          rows={4}
          variant='outlined'
          slotProps={{ htmlInput: { maxLength: 300 } }}
          sx={{
            '& label.Mui-focused': {
              color: '#5651e5',
            },
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#5651e5',
              },
            },
            mb: 2,
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSave}
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
            onClick={handleCancel}
            sx={{ borderRadius: '25px', borderColor: '#5651e5', color: '#5651e5', ml: '8px' }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default EditBioModal;