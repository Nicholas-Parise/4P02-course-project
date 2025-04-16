import React, { useState, useRef} from 'react'
import {
  Box,
  Button,
  Avatar,
  Stack,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const EditPictureModal = ({ onSave }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert('Please select an image to upload.')
      return
    }
    onSave(selectedImage)
  }

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Avatar
        src={previewUrl || '/default-avatar.png'}
        alt="Profile Picture Preview"
        sx={{ width: 150, height: 150, mx: 'auto', mb: 3 }}
      />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />

      <Stack spacing={2}>
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={handleUploadClick}
          sx={{
            color: "#5651e5",
            borderColor: "#5651e5",
            borderRadius: '25px',
          }}
        >
          Choose Image
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedImage}
          sx={{
            background: 'linear-gradient(to right, #8d8aee, #5651e5)',
            color: 'white',
            borderRadius: '25px',
            '&:hover': { background: 'linear-gradient(to right, #5651e5, #343188)'
            },
            '&:disabled': {
              background: '#ccc',
              color: '#888',
              cursor: 'not-allowed',
              pointerEvents: 'auto'
            },
          }}
        >
          Upload
        </Button>
      </Stack>
    </Box>
  )
}

export default EditPictureModal;