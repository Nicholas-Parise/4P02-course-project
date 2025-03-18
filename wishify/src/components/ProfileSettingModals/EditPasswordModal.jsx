import React from 'react'
import { Modal, Button, TextField, Typography, Box, Divider } from '@mui/material'

const EditPasswordModal = ({ open, handleClose, onSave }) => {
  const [newPasswordValue, setNewPasswordValue] = React.useState("")
  const [confirmPasswordValue, setConfirmPasswordValue] = React.useState("")
  const [oldPasswordValue, setOldPasswordValue] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setOldPasswordValue('')
      setNewPasswordValue('')
      setConfirmPasswordValue('')
    }
  }, [open])

  const handleSave = () => {
    onSave(newPasswordValue)
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
        <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 'bold', color: '#5651e5' }}>Change Password</Typography>

        <Divider sx={{mb: 2}} />

        <Typography variant='body1' mb={2}>
          You will need to enter your old password to set a new one.
        </Typography>

        <Divider sx={{mb: 2}} />

        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter old password"
            type="password"
            value={oldPasswordValue}
            onChange={(e) => setOldPasswordValue(e.target.value)}
            fullWidth
            variant='outlined'
            sx={{mb: 2}}
          />

          <Divider sx={{mb: 2}} />

          <TextField
            label="Enter new password"
            type="password"
            value={newPasswordValue}
            onChange={(e) => setNewPasswordValue(e.target.value)}
            fullWidth
            variant='outlined'
            sx={{mb: 2}}
          />

          <TextField
            label="Confirm new password"
            type="password"
            value={confirmPasswordValue}
            onChange={(e) => setConfirmPasswordValue(e.target.value)}
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

export default EditPasswordModal;