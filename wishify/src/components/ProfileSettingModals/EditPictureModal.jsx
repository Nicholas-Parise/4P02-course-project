import React, { useState, useRef} from 'react'
import {
  Box,
  Button,
  Avatar,
  Stack,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { data } from 'react-router-dom'

const EditPictureModal = ({ onClose }) => {
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

    const formData = new FormData()
    formData.append('image', selectedImage)

    try {
      const response = await fetch('https://api.wishify.ca/users/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Accept': 'application/json',
        },
        body: formData
      })

      if (response.ok) {
        alert('Image uploaded successfully!')
        onClose()
      } else {
        alert('Failed to upload image. Please try again.')
      }
    }
    catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    }
  }

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Avatar
        src={previewUrl || '/default-avatar.png'}
        alt="Profile Picture Preview"
        sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
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
            backgroundColor: '#5651e5',
            color: 'white' ,
            borderRadius: '25px'
          }}
        >
          Upload
        </Button>
      </Stack>
    </Box>
  )
}

export default EditPictureModal;