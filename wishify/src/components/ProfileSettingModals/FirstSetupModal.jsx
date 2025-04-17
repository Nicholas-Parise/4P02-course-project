import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid2,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Box,
  Typography,
  Divider,
  Avatar,
  Stack,
} from "@mui/material"
import { Close } from "@mui/icons-material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"



const FirstSetupModal = ({ open, onClose, bioValue, likesValues }) => {
  const [predefinedItems, setPredefinedItems] = useState([])
  const [unableToFetchCategories, setUnableToFetchMessage] = useState(false)

  const [successMessage, setSuccessMessage] = useState('')

  const [step, setStep] = useState(1)
  const [bio, setBio] = useState('')

  const [likesLeft, setLikesLeft] = useState(0)
  const [likes, setLikes] = useState([])
  const [likesToAdd, setLikesToAdd] = useState([])

  const [dislikesLeft, setDislikesLeft] = useState(0)
  const [dislikes, setDislikes] = useState([])
  const [dislikesToAdd, setDislikesToAdd] = useState([])

  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const [search, setSearch] = useState('')

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`https://api.wishify.ca/categories`)
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setPredefinedItems(data)
      } catch (error) {
        console.error("Error fetching categories: ", error.message)
        setUnableToFetchMessage(true)
      }
    }

    fetchCategories()
  }, [])

  React.useEffect(() => {
    console.log('likesValues', likesValues)
    if (bioValue) {
      setBio(bioValue)
    }
    if (likesValues) {
      setLikes(likesValues.filter((item) => item.love))
      setDislikes(likesValues.filter((item) => !item.love))
    }
  }, [])
  
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

  const removeImage = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    fileInputRef.current.value = null
  }

  React.useEffect(() => {
    const filteredLikes = likes.filter(item => item.love)
    const filteredDislikes = dislikes.filter(item => !item.love)
    setLikesLeft(12 - filteredLikes.length)
    setDislikesLeft(12 - filteredDislikes.length)
  }, [likesValues])

  const handleNext = () => {
    setSearch('')
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setSearch('')
    setStep(prev => prev - 1)
  }

  const handleSave = async () => {
    if (!bio && likesToAdd.length === 0 && dislikesToAdd.length === 0) {
      setSuccessMessage("Thanks for signing up! You can always update your profile later in profile settings. We hope you enjoy using Wishify!")
      handleNext()
      return
    }

    let bioError = false
    let likesError = false
    let imageError = false
    
    if (bio) {
      bioError = await handleSaveBio()
    }

    if (likesToAdd.length > 0 || dislikesToAdd.length > 0) {
      const categories = [
        ...likesToAdd.map(item => ({
          id: item.id,
          love: true
        })),
        ...dislikesToAdd.map(item => ({
          id: item.id,
          love: false
        }))
      ]
      likesError = await handleSaveLikes(categories)
    }

    if (selectedImage) {
      imageError = await handleSavePicture(selectedImage)
    }

    if (bioError || likesError || imageError) {
      setSuccessMessage('Uh oh! There was an error saving your profile. Please try again later in profile settings.')
      handleNext()
      return
    } else {
      setSuccessMessage('Profile updated successfully! You can now start using Wishify.')
      handleNext()
      return
    }
  };

  // returns true if there was an error, otherwise false
  const handleSaveBio = async () => {
    try {
      const response = await fetch('https://api.wishify.ca/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio: bio })
      })

      if (!response.ok) {
        throw new Error('Failed to save bio')
      }
      const data = await response.json()
    } catch (err) {
      return true
    }
    return false
  }

  // returns true if there was an error, otherwise false
  const handleSaveLikes = async (categories) => {
    try {
      const response = await fetch('https://api.wishify.ca/users/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({categories})
      })

      if (!response.ok) {
        throw new Error('Failed to save likes')
      }
      const data = await response.json()
    } catch (err) {
      return true
    }
    return false
  }

  const handleSavePicture = async (picture) => {
    if (!selectedImage) {
      alert('Please select an image to upload.')
      return false
    }

    const formData = new FormData()
    formData.append('picture', selectedImage)

    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const response = await fetch('https://api.wishify.ca/users/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData
      })

      const result = await response.json()
      console.log(result)

      if (response.ok) {
        throw new Error('Failed to upload image')
      }
      const data = await response.json()
    }
    catch (error) {
      return true
    }
    return false
  }

  const changeFirstSetup = async (firstSetup) => {
    try {
      const response = await fetch('https://api.wishify.ca/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ setup: firstSetup })
      })
      if (!response.ok) {
        throw new Error('Failed to change first setup')
      }
      const data = await response.json()
    } catch (err) {
      console.error(err)
      return true
    }
    return false
  }

  const handleAddLike = (item) => {
    if (likes.length + likesToAdd.length < 12) {
      setLikesToAdd((prev) => [...prev, item])
      setLikesLeft((prev) => prev - 1)
    }
    setSearch('')
  }

  const handleAddDislike = (item) => {
    if (dislikes.length + dislikesToAdd.length < 12) {
      setDislikesToAdd((prev) => [...prev, item])
      setDislikesLeft((prev) => prev - 1)
    }
    setSearch('')
  }

  const handleRemoveLike = (item) => {
    setLikesToAdd((prev) => prev.filter((i) => i !== item))
    setLikesLeft((prev) => prev + 1)
  }

  const handleRemoveDislike = (item) => {
    setDislikesToAdd((prev) => prev.filter((i) => i !== item))
    setDislikesLeft((prev) => prev + 1)
  }

  const handleClose = () => {
    changeFirstSetup(false)
    onClose()
  }

  return (
    <Dialog
      open={open} 
      onClose={() => {}} 
      maxWidth="sm" 
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '25px',
            bgcolor: 'background.paper',
            border: '2px solid #5651e5',
          }
        }
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#5651e5',
          fontSize: '1.5rem',
        }}
      >
        Profile Setup {step === 5 ? 'Complete' : '(' + step + '/4)'}
        <Divider />
      </DialogTitle>
      <DialogContent>
        {step === 1 && (
          <Box>
            <Typography>
              Welcome to Wishify! Please take a moment to complete your profile so you can make the most out of what we have to offer.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ mb: 2 }}>
              To get started, let others known a bit about yourself. This could help them determine better gift ideas for you.
            </Typography>

            <TextField
              label="About me..."
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              sx={{
                '& label.Mui-focused': {
                  color: '#5651e5',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#5651e5',
                  },
                },
                mb: 2,
              }}
            />
          </Box>
        )}

        {step === 2 && (
          <Box>
            <Typography>You can also select likes and dislikes, which lets others know about some general categories of things that you're interested in, or not! Let's start by selecting some likes.</Typography>

            <Divider sx={{ mt: 2, mb: 2 }} />

            <Typography variant="body1">
              You can select up to {likesLeft} more {likesLeft === 1 ? 'like.' : 'likes.'}
            </Typography>

            {unableToFetchCategories && (
              <div className={`response-message error`}>
                There was an error fetching the categories. Please refresh the page and try again later.
              </div>
            )}

            <TextField
              variant="outlined"
              fullWidth
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ 
                mt: 2,
                mb: 2,
                '& label.Mui-focused': {
                  color: '#5651e5',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#5651e5',
                  },
                },
              }}
            />

            <Grid2 container spacing={2} justifyContent={'center'}>
              {/* Available Items List */}
              <Grid2 item xs={12} md={6} sx={{ minWidth: 0 }}>
                <Paper sx={{
                  height: 200,
                  width: 260,
                  overflowY: 'auto',
                  p: 1,
                  boxSizing: 'border-box',
                }}
                >
                  <Typography variant="subtitle1" sx={{ color: '#5651e5' }}>Categories</Typography>
                  <List sx={{ width: '100%' }}>
                    {predefinedItems
                      .filter((item) =>
                        !likes.some((value) => value.name === item.name))
                      .filter((item) =>
                        !dislikes.some((value) => value.name === item.name))
                      .filter((item) => 
                        !likesToAdd.some((value) => value.name === item.name))
                      .filter((item) =>
                        !dislikesToAdd.some((value) => value.name === item.name))
                      .filter((item) =>
                        item.name.toLowerCase().includes(search.toLowerCase()))
                      .map((item) => (
                        <ListItem key={item.id} button onClick={() => handleAddLike(item)}>
                          <ListItemText
                            primary={item.name}
                            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          />
                        </ListItem>
                      ))}
                  </List>
                </Paper>
              </Grid2>

              {/* Selected Items List */}
              <Grid2 item xs={12} md={6}>
                <Paper sx={{
                  height: 200,
                  width: 260,
                  overflowY: 'auto', 
                  p: 1,
                  boxSizing: 'border-box',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: '#5651e5'}}>Selected Items</Typography>
                  {likesToAdd.length > 0 ? (
                    <List sx={{ width: '100%' }}>
                      {likesToAdd.map((item) => (
                        <ListItem key={item.id} secondaryAction={
                          <IconButton edge="end" onClick={() => handleRemoveLike(item)}>
                            <Close />
                          </IconButton>
                        }>
                          <ListItemText 
                            primary={item.name} 
                            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                      No items selected
                    </Typography>
                  )}
                </Paper>
              </Grid2>
            </Grid2>
          </Box>
        )}

        {step === 3 && (
          <Box>
            <Typography>Next choose a few categories of things you aren't interested in.</Typography>

            <Divider sx={{ mt: 2, mb: 2 }} />

            <Typography variant="body1">
              You can select up to {dislikesLeft} more {dislikesLeft === 1 ? 'dislike.' : 'dislikes.'}
            </Typography>

            {unableToFetchCategories && (
              <div className={`response-message error`}>
                There was an error fetching the categories. Please refresh the page and try again later.
              </div>
            )}

            <TextField
              variant="outlined"
              fullWidth
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ 
                mt: 2,
                mb: 2,
                '& label.Mui-focused': {
                  color: '#5651e5',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#5651e5',
                  },
                },
              }}
            />

            <Grid2 container spacing={2} justifyContent={'center'}>
              {/* Available Items List */}
              <Grid2 item xs={12} md={6} sx={{ minWidth: 0 }}>
                <Paper sx={{
                  height: 200,
                  width: 260,
                  overflowY: 'auto',
                  p: 1,
                  boxSizing: 'border-box',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: '#5651e5' }}>Categories</Typography>
                  <List sx={{ width: '100%' }}>
                    {predefinedItems
                      .filter((item) =>
                        !likes.some((value) => value.name === item.name))
                      .filter((item) =>
                        !dislikes.some((value) => value.name === item.name))
                      .filter((item) => 
                        !likesToAdd.some((value) => value.name === item.name))
                      .filter((item) =>
                        !dislikesToAdd.some((value) => value.name === item.name))
                      .filter((item) =>
                        item.name.toLowerCase().includes(search.toLowerCase()))
                      .map((item) => (
                        <ListItem key={item.id} button onClick={() => handleAddDislike(item)}>
                          <ListItemText
                            primary={item.name}
                            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          />
                        </ListItem>
                      ))}
                  </List>
                </Paper>
              </Grid2>

              {/* Selected Items List */}
              <Grid2 item xs={12} md={6}>
                <Paper sx={{
                  height: 200,
                  width: 260,
                  overflowY: 'auto', 
                  p: 1,
                  boxSizing: 'border-box',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: '#5651e5'}}>Selected Items</Typography>
                  {dislikesToAdd.length > 0 ? (
                    <List sx={{ width: '100%' }}>
                      {dislikesToAdd.map((item) => (
                        <ListItem key={item.id} secondaryAction={
                          <IconButton edge="end" onClick={() => handleRemoveDislike(item)}>
                            <Close />
                          </IconButton>
                        }>
                          <ListItemText 
                            primary={item.name} 
                            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                      No items selected
                    </Typography>
                  )}
                </Paper>
              </Grid2>
            </Grid2>
          </Box>
        )}

        {step === 4 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography>
              Almost done! Add a profile picture so people can put a face to the name.
            </Typography>

            <Divider sx={{ my: 2 }} />

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

            <Stack spacing={2} width={'200px'} mx={'auto'}>
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
                  onClick={removeImage}
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
                  Remove Image
                </Button>
              </Stack>
          </Box>
        )}

        {step === 5 && (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {successMessage}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          position: 'relative',
          justifyContent: 'space-between',
          px: 3,
        }}
      >
        {(step > 1 && step < 5) ? ( 
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ 
              borderRadius: '25px', 
              borderColor: '#5651e5', 
              color: '#5651e5',
              mb: '20px',
            }}
          >
            Previous
          </Button>
        ) : (
          <Box sx={{ width: '100px' }} />
        )}

        {step < 4 &&
          <Button
            onClick={handleNext}
            variant="contained"
            sx={{
              background: 'linear-gradient(to right, #8d8aee, #5651e5)',
              color: 'white',
              borderRadius: '25px',
              mb: '20px',
              '&:hover': { background: 'linear-gradient(to right, #5651e5, #343188)' }
            }}
          >
            Next
          </Button>
        }

        {step === 4 &&
          <Button
            onClick={handleSave}
            variant="contained" color="primary"
            sx={{
              background: 'linear-gradient(to right, #8d8aee, #5651e5)',
              color: 'white',
              borderRadius: '25px',
              mb: '20px',
              '&:hover': { background: 'linear-gradient(to right, #5651e5, #343188)' }
            }}
          >
            Save
          </Button>
        }

        {step === 5 && 
        <>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            background: 'linear-gradient(to right, #8d8aee, #5651e5)',
            color: 'white',
            borderRadius: '25px',
            mb: '20px',
            '&:hover': { background: 'linear-gradient(to right, #5651e5, #343188)' }
          }}
        >
          Done
        </Button>
        <Box sx={{ width: '100px' }} />
        </>
        }

      </DialogActions>
    </Dialog>
  )
}

export default FirstSetupModal