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
    width: 500,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
  }

  return (
    <Modal open={open} onClose={handleCancel}>
      <Box sx={style}>
        <Typography variant='h6'>Edit Biography</Typography>

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
          sx={{mb: 2}}
        />

        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ mr: 1 }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default EditBioModal;