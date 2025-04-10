import React, { useState } from 'react'
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
} from "@mui/material";
import { Close } from "@mui/icons-material";



const FirstSetupModal = ({ open, handleClose }) => {
  const [predefinedItems, setPredefinedItems] = useState([])
  const [unableToFetchCategories, setUnableToFetchMessage] = useState(false)

  const [successMessage, setSuccessMessage] = useState('')

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

  const [step, setStep] = useState(1)
  const [bio, setBio] = useState('')

  const [likesLeft, setLikesLeft] = useState(12)
  const [likes, setLikes] = useState([])
  const [likesToAdd, setLikesToAdd] = useState([])

  const [dislikesLeft, setDislikesLeft] = useState(12)
  const [dislikes, setDislikes] = useState([])
  const [dislikesToAdd, setDislikesToAdd] = useState([])

  const [search, setSearch] = useState('')


  const handleNext = () => {
    setSearch('')
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setSearch('')
    setStep(prev => prev - 1)
  }

  const handleSave = () => {
    if (!bio && likesToAdd.length === 0 && dislikesToAdd.length === 0) {
      setSuccessMessage("Thanks for signing up! You can always update your profile later in profile settings. We hope you enjoy using Wishify!")
      handleNext()
      // change firstSetup to false.
      return
    }

    let bioError = false
    let likesError = false
    
    if (bio) {
      // bioError = handleSaveBio()
      bioError = true
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
      // likesError = handleSaveLikes(categories)
      likesError = true
    }

    if (bioError || likesError) {
      setSuccessMessage('Uh oh! There was an error saving your profile. Please try again later in profile settings.')
      handleNext()
      // change firstSetup to false.
      return
    } else {
      setSuccessMessage('Profile updated successfully! You can now start using Wishify.')
      handleNext()
      // change firstSetup to false.
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

  const changeFirstSetup = async (firstSetup) => {
    try {
      const response = await fetch('https://api.wishify.ca/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstSetup })
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

  return (
    <Dialog open={open} onClose={() => {}} maxWidth="sm" fullWidth>
      <DialogTitle>Profile Setup {step === 4 ? 'Complete' : '(' + step + '/3)'}</DialogTitle>
      <DialogContent>
        {step === 1 && (
          <Box>
          <Typography>
            Welcome to Wishify! Please take a moment to complete your profile so you can make the most out of what we have to offer.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography>
            To get started, let others known a bit about yourself. This could help them determine better gift ideas for you.
          </Typography>

          <TextField
            margin="dense"
            label="About me..."
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          </Box>
        )}

        {step === 2 && (
          <Box>
            <Typography>You can also select likes and dislikes, which lets others know about some general categories of things that you're interested or not. Let's start by selecting some likes.</Typography>

            <Divider sx={{ mt: 2, mb: 2 }} />

            <Typography variant="body1">
              You can select {likesLeft} more {likesLeft === 1 ? 'like.' : 'likes.'}
            </Typography>

            {unableToFetchCategories && (
              <div className={`response-message error`}>
                There was an error fetching the categories. Please refresh the page and try again later.
              </div>
            )}

            <TextField
              fullwidth
              variant="outlined"
              placeholder={'Search...'}
              sx={{ mt: 2, mb: 2 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Grid2 container spacing={2}>
              {/* Available Items List */}
              <Grid2 item xs={6}>
                <Paper sx={{ height: 200, overflowY: 'auto', p: 1, width: 200, minWidth: 200 }}>
                  <List sx={{ width: '100%' }}>
                    {predefinedItems
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
              <Grid2 item xs={6}>
                <Paper sx={{ height: 200, overflowY: 'auto', p: 1, width: 200, minWidth: 200 }}>
                  <Typography variant="subtitle1">Selected Items</Typography>
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
              You can select {dislikesLeft} more {dislikesLeft === 1 ? 'dislike.' : 'dislikes.'}
            </Typography>

            {unableToFetchCategories && (
              <div className={`response-message error`}>
                There was an error fetching the categories. Please refresh the page and try again later.
              </div>
            )}

            <TextField
              fullwidth
              variant="outlined"
              placeholder={'Search...'}
              sx={{ mt: 2, mb: 2 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Grid2 container spacing={2}>
              {/* Available Items List */}
              <Grid2 item xs={6}>
                <Paper sx={{ height: 200, overflowY: 'auto', p: 1, width: 200, minWidth: 200 }}>
                  <List sx={{ width: '100%' }}>
                    {predefinedItems
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
              <Grid2 item xs={6}>
                <Paper sx={{ height: 200, overflowY: 'auto', p: 1, width: 200, minWidth: 200 }}>
                  <Typography variant="subtitle1">Selected Items</Typography>
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
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {successMessage}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {step > 1 && step < 4 && 
          <Button onClick={handleBack}>Previous</Button>}
        {step < 3 &&
          <Button onClick={handleNext} variant="contained">Next</Button>}
        {step === 3 &&
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>}
        {step === 4 &&
          <Button onClick={handleClose} variant="contained" color="primary">Done</Button>}
      </DialogActions>
      </Dialog>
  )
}

export default FirstSetupModal