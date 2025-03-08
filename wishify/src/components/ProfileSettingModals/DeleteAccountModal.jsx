import React from 'react'
import { Modal, Button, TextField, Typography, Box, Divider } from '@mui/material'

const DeleteAccountModal = ({ open, handleClose, onSave }) => {
  const [password, setPassword] = React.useState("")
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setPassword('')
    }
  } , [open])

  const handleConfirmDelete = () => {
    onSave(password)
    setConfirmOpen(false)
    handleClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setConfirmOpen(true)
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
    <>
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant='h6' color="error">Delete Account</Typography>

        <Divider sx={{mb: 2}} />

        <Typography variant='body1' mb={2}>
          To delete your account, please enter your password.
        </Typography>

        <Typography variant='body2' mb={2} style={{color: 'red'}}>
          Warning: This action is final and cannot be undone.
        </Typography>

        <Divider sx={{mb: 2}} />

        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter account password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant='outlined'
            sx={{mb: 2}}
          />

          <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color='error'
              type="submit">
              Delete Account
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>

    {/* Child modal for confirmation */}
    <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 3,
            borderRadius: 4,
            boxShadow: 24,
            width: '400px',
          }}
        >
          <Typography variant="h6" mb={2} color="error">
            Confirm Account Deletion
          </Typography>
          <Typography variant="body2" mb={2}>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setConfirmOpen(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
              Confirm Deletion
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default DeleteAccountModal