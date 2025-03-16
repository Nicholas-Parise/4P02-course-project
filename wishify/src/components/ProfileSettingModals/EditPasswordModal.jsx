import React from 'react'
import { Modal, Button, TextField, Typography, Box, Divider } from '@mui/material'

const EditPasswordModal = ({ open, handleClose, onSave }) => {
  const [oldPassword, setOldPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setError('')
    }
  }, [open])

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    onSave(newPassword)
    handleClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSave()
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
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 'bold', color: '#5651e5' }}>
          Change Password
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant='body2' mb={2} sx={{ textAlign: 'center' }}>
          You need to enter your old password before setting a new one.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter old password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            variant='outlined'
            sx={{ mb: 2 }}
          />

          <Divider sx={{ mb: 2 }} />

          <TextField
            label="Enter new password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            variant='outlined'
            sx={{ mb: 2 }}
          />

          <TextField
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            variant='outlined'
            sx={{ mb: 2 }}
            error={Boolean(error)}
            helperText={error}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ borderRadius: '25px', borderColor: '#5651e5', color: '#5651e5' }}
            >
              Cancel
            </Button>
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
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

export default EditPasswordModal