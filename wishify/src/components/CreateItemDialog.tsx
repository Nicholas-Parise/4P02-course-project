import { useState, type FormEvent } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Select, SelectChangeEvent, InputLabel, FormControl, Button, MenuItem, TextField } from '@mui/material';
import { Wishlist, WishlistItem } from '../types/types';
import picture1 from '../assets/Groceries.jpg';
import picture2 from '../assets/tech.jpg';
import picture3 from '../assets/Games.jpg';
import picture4 from '../assets/gift.jpg';
import picture5 from '../assets/sports.jpg';
import picture6 from '../assets/clothing.jpeg';

// Preloaded images (you can replace these with your own image URLs)
const preloadedImages = [
  picture1,
  picture2,
  picture3,
  picture4,
  picture5,
  picture6,
];

interface Props {
  open: boolean;
  setOpen: (state: boolean) => void;
  image: string | null;
  setImage: (state: string | null) => void;
  newItem: Partial<WishlistItem>;
  setNewItem: (state: Partial<WishlistItem>) => void;
  wishlists: Wishlist[];
  token: string;
}

const CreateItemDialog = ({ open, setOpen, image, setImage, newItem, setNewItem, wishlists, token }: Props) => {
  const [selectedWishlist, setSelectedWishlist] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Function to check if all required fields are filled
  const isFormValid = () => {
    return (
      newItem.name && // Name is required
      newItem.price !== undefined && newItem.price >= 0 && // Price is required and non-negative
      newItem.quantity !== undefined && newItem.quantity >= 0 && // Quantity is required and non-negative
      selectedWishlist // Wishlist is required
    );
  };

  const createItem = (e: FormEvent) => {
    e.preventDefault();

    const url = 'https://api.wishify.ca/items';

    fetch(url, {
      method: 'post',
      headers: new Headers({
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        name: newItem.name,
        description: newItem.description || '',
        url: newItem.url || '',
        image: selectedImage || '', // Use the selected image
        quantity: newItem.quantity,
        price: newItem.price,
        wishlists_id: Number(selectedWishlist),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOpen(false);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="item-dialog-title"
      aria-describedby="item-dialog-description"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '25px', // Rounded corners
          background: '#FFFFFF', // Background color matching ProfileMenu
          padding: '20px',
          border: '2px solid #5651e5', // Border color
          maxWidth: '900px', // Set max width to 900px
          width: '100%', // Ensure it takes full width up to the max width
        },
      }}
    >
      <DialogTitle id="item-dialog-title" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#000', fontSize: '24px' }}>
        Add New Item
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="item-dialog-description" sx={{ color: '#000' }}>
          Enter the details for the new wishlist item.
        </DialogContentText>

        <form autoComplete="off" onSubmit={createItem}>
          {/* Preloaded Image Selection */}
          <FormControl fullWidth sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
            <DialogContentText sx={{ color: '#000', mb: 2 }}>Choose an image:</DialogContentText>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center', // Center the images horizontally
                maxWidth: '100%', // Ensure the container doesn't overflow
              }}
            >
              {preloadedImages.map((image, index) => (
                <div
                  key={index}
                  style={{
                    border: selectedImage === image ? '2px solid #5651e5' : '2px solid #ccc',
                    borderRadius: '25px',
                    padding: '5px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`Preloaded Image ${index + 1}`}
                    style={{ width: '100px', height: '100px', borderRadius: '25px' }}
                  />
                </div>
              ))}
            </div>
          </FormControl>

          {/* Wishlist Select */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel
              id="wishlist-select"
              required
              sx={{
                color: '#5651e5',
                backgroundColor: '#FFFFFF', // Match the dialog background
                padding: '0 5px', // Add padding to prevent overlap
                transform: 'translate(14px, -6px) scale(0.75)', // Adjust position
              }}
            >
              Wishlist
            </InputLabel>
            <Select
              labelId="wishlist-select"
              label="Wishlist"
              value={selectedWishlist}
              required
              onChange={(event: SelectChangeEvent) => setSelectedWishlist(event.target.value)}
              sx={{
                borderRadius: '8px',
                border: '2px solid #5651e5',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiSelect-select': {
                  padding: '12px 14px', // Adjust padding for better alignment
                },
              }}
            >
              {wishlists.length > 0 &&
                wishlists.map((wishlist) => (
                  <MenuItem key={wishlist.id} value={wishlist.id}>
                    {wishlist.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Name Field */}
          <TextField
            sx={{
              mt: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                border: '2px solid #5651e5',
                '&.Mui-focused': {
                  border: '2px solid #ccc', // Grey border when focused
                },
                '& fieldset': {
                  border: 'none', // Remove default border
                },
              },
            }}
            variant="outlined" // Use the outlined variant
            InputLabelProps={{
              sx: {
                color: '#5651e5',
                backgroundColor: '#FFFFFF', // Match the dialog background
                padding: '0 5px', // Add padding to prevent overlap
                transform: 'translate(14px, -6px) scale(0.75)', // Adjust position
              },
            }}
            label="Name"
            value={newItem.name || ''}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
            fullWidth
          />

          {/* Description Field */}
          <TextField
            sx={{
              mt: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                border: '2px solid #5651e5',
                '&.Mui-focused': {
                  border: '2px solid #ccc', // Grey border when focused
                },
                '& fieldset': {
                  border: 'none', // Remove default border
                },
              },
            }}
            variant="outlined" // Use the outlined variant
            InputLabelProps={{
              sx: {
                color: '#5651e5',
                backgroundColor: '#FFFFFF', // Match the dialog background
                padding: '0 5px', // Add padding to prevent overlap
                transform: 'translate(14px, -6px) scale(0.75)', // Adjust position
              },
            }}
            label="Description"
            multiline
            value={newItem.description || ''}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            fullWidth
          />

          {/* Price Field */}
          <TextField
            sx={{
              mt: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                border: '2px solid #5651e5',
                '&.Mui-focused': {
                  border: '2px solid #ccc', // Grey border when focused
                },
                '& fieldset': {
                  border: 'none', // Remove default border
                },
              },
            }}
            variant="outlined" // Use the outlined variant
            InputLabelProps={{
              sx: {
                color: '#5651e5',
                backgroundColor: '#FFFFFF', // Match the dialog background
                padding: '0 5px', // Add padding to prevent overlap
                transform: 'translate(14px, -6px) scale(0.75)', // Adjust position
              },
            }}
            type="number"
            label="Price"
            value={newItem.price || ''}
            required
            onChange={(e) => {
              let price = Number(e.target.value);
              if (price < 0) price = 0;
              setNewItem({ ...newItem, price: price });
            }}
            fullWidth
          />

          {/* Quantity Field */}
          <TextField
            sx={{
              mt: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                border: '2px solid #5651e5',
                '&.Mui-focused': {
                  border: '2px solid #ccc', // Grey border when focused
                },
                '& fieldset': {
                  border: 'none', // Remove default border
                },
              },
            }}
            variant="outlined" // Use the outlined variant
            InputLabelProps={{
              sx: {
                color: '#5651e5',
                backgroundColor: '#FFFFFF', // Match the dialog background
                padding: '0 5px', // Add padding to prevent overlap
                transform: 'translate(14px, -6px) scale(0.75)', // Adjust position
              },
            }}
            value={newItem.quantity || ''}
            label="Quantity"
            type="number"
            required
            onChange={(e) => {
              let quantity = Number(e.target.value);
              if (quantity < 0) quantity = 0;
              setNewItem({ ...newItem, quantity: quantity });
            }}
            fullWidth
          />

          {/* Purchase Link Field */}
          <TextField
            sx={{
              mt: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                border: '2px solid #5651e5',
                '&.Mui-focused': {
                  border: '2px solid #000', // Grey border when focused
                },
                '& fieldset': {
                  border: 'none', // Remove default border
                },
              },
            }}
            variant="outlined" // Use the outlined variant
            InputLabelProps={{
              sx: {
                color: '#5651e5',
                backgroundColor: '#FFFFFF', // Match the dialog background
                padding: '0 5px', // Add padding to prevent overlap
                transform: 'translate(14px, -6px) scale(0.75)', // Adjust position
              },
            }}
            label="Purchase Link"
            type="url"
            value={newItem.url || ''}
            onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
            fullWidth
          />

          {/* Create Button */}
          <Button
            sx={{
              mt: 3,
              borderRadius: '25px', // Border radius
              padding: '10px', // Padding
              background: isFormValid()
                ? 'linear-gradient(135deg, #8d8aee, #5651e5)' // Default gradient when active
                : 'none', // No background when inactive
              color: isFormValid() ? '#fff' : '#808080', // White text when active, grey when inactive
              textTransform: 'none',
              border: isFormValid() ? 'none' : '2px solid #5651e5', // No border when active, border when inactive
              '&:hover': {
                background: isFormValid()
                  ? 'linear-gradient(135deg, #5651e5, #343188)' // Hover gradient when active
                  : 'none', // No hover background when inactive
              },
              '&:disabled': {
                color: '#808080', // Grey text when disabled
                border: '2px solid #5651e5', // Border when disabled
                background: 'none', // No background when disabled
              },
            }}
            type="submit"
            variant="contained"
            fullWidth
            disabled={!isFormValid()} // Disable the button if the form is not valid
          >
          Create
        </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItemDialog;