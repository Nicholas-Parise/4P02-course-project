import React from 'react'
import { Modal, Button, TextField, Typography, Box, Divider } from '@mui/material'

const DeleteAccountModal = ({ open, handleClose, onSave }) => {
  const [password, setPassword] = React.useState("")
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [input, setInput] = React.useState('')
  const [responseMessage, setResponseMessage] = React.useState("")
  const [responseType, setResponseType] = React.useState("")

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
    if (password.length < 8) {
      setResponseMessage("Please ensure your password is valid.")
      setResponseType("error")
      return
    }
    setConfirmOpen(true)
  }

  const handleCancel = () => {
    setResponseMessage('')
    setResponseType('')
    handleClose()
  }

  const handleCancelConfirm = () => {
    setConfirmOpen(false)
    setInput('')
    handleCancel()
  }

  const style = {
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
    <Modal open={open} onClose={handleCancel}>
      <Box sx={style}>
        <Typography variant='h6' color="error" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#5651e5' }}>Delete Account</Typography>

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
              variant="outlined"
              onClick={handleCancel}
              sx={{ borderRadius: '25px', borderColor: '#5651e5', color: '#5651e5', mr: '8px' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color='error'
              sx={{
                background: 'white',
                color: 'red',
                border: '2px solid red',
                borderRadius: '25px',
                '&:hover': { background: '#ffebeb' }
              }}
              type="submit">
              Delete Account
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>

    {/* Child modal for confirmation */}

    <Modal open={confirmOpen} onClose={handleCancelConfirm}>
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
            border: '2px solid #5651e5', // Same border style
          }}
        >
          <Typography variant="h6" mb={2} color="error">
            Confirm Account Deletion
          </Typography>

          <Typography variant="body2" mb={2}>
            Are you sure you want to delete your account? This action cannot be undone.
            <br /><br />
            Type <b>DELETE</b> in the box below to confirm.
          </Typography>
            
          <TextField
            fullWidth
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type DELETE here'
            sx={{ mb: 2 }}
          />
            
          <Divider sx={{ mb: 2 }} />

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="outlined" onClick={handleCancelConfirm} sx={{ borderRadius: '25px', borderColor: '#5651e5', color: '#5651e5', mr: '8px' }}>
              Cancel
            </Button>
            <Button 
                variant="contained" 
                color="error" 
                onClick={handleConfirmDelete}
                disabled={input !== 'DELETE'}
                sx={{
                  background: 'white',
                  color: 'red',
                  border: '2px solid red',
                  borderRadius: '25px',
                  '&:hover': { background: '#ffebeb' }
                }}>
              Confirm Deletion
            </Button>
          </Box>
        </Box>
    </Modal>
    </>
  )
}

export default DeleteAccountModal