import React from 'react'
import { Box, Button, Modal, Typography, TextField, List, ListItem, ListItemText, Divider, IconButton, Grid2, Paper } from '@mui/material'
import { Add, Close } from '@mui/icons-material'

const AddLikesModal = ({ open, handleClose, type, values, onSave }) => {
  const [predefinedItems, setPredefinedItems] = React.useState([])

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
        console.error("Error fetching categories: ", error)
      }
    }

    fetchCategories()
  }, [])

  const [itemsLeft, setItemsLeft] = React.useState(0)
  const [items, setItems] = React.useState([])
  const [itemsToAdd, setItemsToAdd] = React.useState([])
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    const filteredItems = values.filter(item => (type === "Likes" ? item.love : !item.love))

    setItems(filteredItems)
    setItemsLeft(12 - filteredItems.length)
  }, [values])

  const handleSave = () => {
    setItems((prev) => {
      const updatedItems = [...prev, ...itemsToAdd];
      onSave(itemsToAdd, type.toLowerCase());
      return updatedItems;
    });

    setItemsToAdd([]);
    setItemsLeft(12 - items.length);
  
    handleClose();
  };

  const handleAddItem = (item) => {
    if (items.length + itemsToAdd.length < 12) {
      setItemsToAdd((prev) => [...prev, item])
      setItemsLeft((prev) => prev - 1)
    }
    setSearch('')
  }

  const handleRemoveItem = (item) => {
    setItemsToAdd((prev) => prev.filter((i) => i !== item))
    setItemsLeft((prev) => prev + 1)
  }

  const handleCancel = () => {
    setItemsToAdd([])
    setItemsLeft(12 - items.length)
    handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          borderRadius: 7,
          boxShadow: 24,
          p: 4,
        }}
      >
      <Typography variant="h6">Select more {type}</Typography>

      <Divider sx={{ mt: 2, mb: 2 }} />

      <Typography variant="body1">
        You can select {itemsLeft} more {itemsLeft === 1 ? type.toLowerCase().slice(0, -1) : type.toLowerCase()}.
      </Typography>

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
                  !itemsToAdd.some((value) => value.name === item.name))
                .filter((item) =>
                  !values.some((value) => value.name === item.name))
                .filter((item) =>
                  item.name.toLowerCase().includes(search.toLowerCase()))
                .map((item) => (
                  <ListItem key={item.id} button onClick={() => handleAddItem(item)}>
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
            {itemsToAdd.length > 0 ? (
              <List sx={{ width: '100%' }}>
                {itemsToAdd.map((item) => (
                  <ListItem key={item.id} secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveItem(item)}>
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

      <Divider sx={{ mb: 2, mt: 2 }} />

      <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ mr: 1 }}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>
    </ Box>
  </Modal>
  )
}

export default AddLikesModal