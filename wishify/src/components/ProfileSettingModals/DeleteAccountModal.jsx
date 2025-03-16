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

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #5651e5', // Same border style
    borderRadius: '25px',
    boxShadow: 24,
    p: 4,
  }

  return (
    <>
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 'bold', color: '#5651e5' }}>
          Delete Account
        </Typography>

        <Divider sx={{mb: 2}} />

        <Typography variant='body1' mb={2} sx={{ textAlign: 'center' }}>
          To delete your account, please enter your password.
        </Typography>

        <Typography variant='body2' mb={2} sx={{ color: 'red', textAlign: 'center' }}>
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

          <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
            <Button
              variant="contained"
              sx={{
                background: 'white',
                color: 'red',
                border: '2px solid red',
                borderRadius: '25px',
                '&:hover': { background: '#ffebeb' }
              }}
              type="submit"
            >
              Delete Account
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

    {/* Confirmation Modal */}
    <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box sx={{ ...modalStyle, width: '350px' }}>
          <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#5651e5' }}>
            Confirm Account Deletion
          </Typography>
          <Typography variant="body2" mb={2} sx={{ textAlign: 'center' }}>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                background: 'white',
                color: 'red',
                border: '2px solid red',
                borderRadius: '25px',
                '&:hover': { background: '#ffebeb' }
              }}
              onClick={handleConfirmDelete}
            >
              Confirm Deletion
            </Button>
            <Button
              variant="outlined"
              onClick={() => setConfirmOpen(false)}
              sx={{ borderRadius: '25px', borderColor: '#5651e5', color: '#5651e5' }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
    </Modal>
    </>
  )
}

export default DeleteAccountModal