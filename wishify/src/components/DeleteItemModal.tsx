import { Box, Button, Divider, Modal, Typography } from '@mui/material'
import { type WishlistItem } from '../types/types';

interface Props { 
    isModalOpen: boolean, 
    setIsModalOpen: (state: boolean) => void,
    onDelete: (id: number) => void,
    item: WishlistItem
}

const DeleteItemModal = ({ isModalOpen, setIsModalOpen, onDelete, item } : Props) => {
  return (
    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
            width: '90%', // Responsive width
            border: '2px solid #5651e5', // Same border style
          }}
        >
          <Typography variant="h6" mb={2} color="error">
            Confirm Item Deletion
          </Typography>
          <Typography variant="body2" mb={2}>
            Are you sure you want to delete this item?
          </Typography>
          <Typography variant="body2" mb={2}>
            {item.name}
          </Typography>
          <Typography variant="body2" mb={2}>
            This action cannot be undone.
          </Typography>
          <Divider sx={{ mb: 2 }} />
          

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="outlined" onClick={() => setIsModalOpen(false)} sx={{ borderRadius: '25px', borderColor: '#5651e5', color: '#5651e5', mr: '8px' }}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={() => onDelete(item.id)} sx={{
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
  )
}

export default DeleteItemModal