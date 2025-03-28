import React from 'react'
import { Modal, Button, TextField, Typography, Box, Divider } from '@mui/material'

const EditEmailModal = ({ open, handleClose, value, onSave }) => {
  const [inputValue, setInputValue] = React.useState("")
  const [passwordValue, setPasswordValue] = React.useState("")
  const [responseMessage, setResponseMessage] = React.useState("");
  const [responseType, setResponseType] = React.useState(""); 

  React.useEffect(() => {
    if (open) {
      setInputValue('')
      setPasswordValue('')
    }
  }, [open])

  const handleSave = () => {
    if (!isValidInput()) {
      setResponseMessage("Please enter a valid email address and password.")
      setResponseType("error")
      return
    }
    onSave(inputValue)
    handleCancel();
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSave()
  }

  const handleCancel = () => {
    setResponseMessage("")
    setResponseType("")
    handleClose()
  }

  const isValidInput = () => {
    return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputValue) &&
        passwordValue.length >= 8)
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
    <Modal open={open} onClose={handleCancel}>
      <Box sx={style}>
        <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 'bold', color: '#5651e5' }}>Edit Email Address</Typography>

        <Divider sx={{mb: 2}} />

        <Typography variant='body1' mb={2}>
          Your current email address is <strong>{value}</strong>
        </Typography>

        <Typography variant='body2' mb={2}>
          Your email address is used to log in to your account and to receive notifications.
        </Typography>

        <Divider sx={{mb: 2}} />

        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter new email address"
            type="email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            fullWidth
            variant='outlined'
            slotProps={{ htmlInput: { maxLength: 256 } }}
            sx={{mb: 2}}
          />

<         TextField
            label="Enter your account password"
            type="password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            fullWidth
            variant='outlined'
            slotProps={{ htmlInput: { maxLength: 64 } }}
            sx={{mb: 2}}
          />

          {responseMessage && (
            <div style={{ marginBottom: '10px'}} className={`response-message ${responseType}`}>
              {responseMessage}
            </div>
          )}

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
              onClick={handleCancel}
              sx={{ borderRadius: '25px', borderColor: '#5651e5', color: '#5651e5' }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

export default EditEmailModal;