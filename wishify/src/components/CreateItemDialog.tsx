import { useState, type FormEvent } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Select, SelectChangeEvent, InputLabel, FormControl, Button, MenuItem, TextField } from '@mui/material';
import { Wishlist, WishlistItem } from '../types/types';
import picture1 from '../assets/Groceries.jpg';
import picture2 from '../assets/tech.jpg';
import picture3 from '../assets/Games.jpg';
import picture4 from '../assets/gift.jpg';
import picture5 from '../assets/sports.jpg';
import picture6 from '../assets/clothing.jpeg';

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

  const isFormValid = () => {
    return (
      newItem.name && 
      newItem.price !== undefined && newItem.price >= 0 && 
      newItem.quantity !== undefined && newItem.quantity >= 0 && 
      selectedWishlist 
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
        image: selectedImage || '', 
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
          borderRadius: '25px', 
          background: '#FFFFFF', 
          padding: '20px',
          border: '2px solid #5651e5', 
          maxWidth: '900px', 
          width: '100%', 
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
          <FormControl fullWidth sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
            <DialogContentText sx={{ color: '#000', mb: 2 }}>Choose an image:</DialogContentText>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center', 
                maxWidth: '100%', 
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

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel
              id="wishlist-select"
              required
              sx={{
                color: '#5651e5',
                backgroundColor: '#FFFFFF', 
                padding: '0 5px', 
                transform: 'translate(14px, -6px) scale(0.75)', 
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
                  padding: '12px 14px', 
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

          <TextField
            sx={{
              mt: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                border: '2px solid #5651e5',
                '&.Mui-focused': {
                  border: '2px solid #ccc', 
                },
                '& fieldset': {
                  border: 'none', 
                },
              },
            }}
            variant="outlined" 
            InputLabelProps={{
              sx: {
                color: '#5651e5',
                backgroundColor: '#FFFFFF', 
                padding: '0 5px', 
                transform: 'translate(14px, -6px) scale(0.75)', 
              },
            }}
            label="Name"
            value={newItem.name || ''}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
            fullWidth
          />


          <TextField
            sx={{
              mt: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                border: '2px solid #5651e5',
                '&.Mui-focused': {
                  border: '2px solid #ccc', 
                },
                '& fieldset': {
                  border: 'none', 
                },
              },
            }}
            variant="outlined" 
            InputLabelProps={{
              sx: {
                color: '#5651e5',
                backgroundColor: '#FFFFFF', 
                padding: '0 5px', 
                transform: 'translate(14px, -6px) scale(0.75)', 
              },
            }}
            label="Description"
            multiline
            value={newItem.description || ''}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            fullWidth
          />

          <TextField
            sx={{
              mt: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                border: '2px solid #5651e5',
                '&.Mui-focused': {
                  border: '2px solid #ccc', 
                },
                '& fieldset': {
                  border: 'none', 
                },
              },
            }}
            variant="outlined" 
            InputLabelProps={{
              sx: {
                color: '#5651e5',
                backgroundColor: '#FFFFFF', 
                padding: '0 5px', 
                transform: 'translate(14px, -6px) scale(0.75)', 
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

          <TextField
            sx={{
              mt: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                border: '2px solid #5651e5',
                '&.Mui-focused': {
                  border: '2px solid #ccc', 
                },
                '& fieldset': {
                  border: 'none', 
                },
              },
            }}
            variant="outlined" 
            InputLabelProps={{
              sx: {
                color: '#5651e5',
                backgroundColor: '#FFFFFF', 
                padding: '0 5px', 
                transform: 'translate(14px, -6px) scale(0.75)', 
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

          <TextField
            sx={{
              mt: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                border: '2px solid #5651e5',
                '&.Mui-focused': {
                  border: '2px solid #000', 
                },
                '& fieldset': {
                  border: 'none', 
                },
              },
            }}
            variant="outlined" 
            InputLabelProps={{
              sx: {
                color: '#5651e5',
                backgroundColor: '#FFFFFF',
                padding: '0 5px', 
                transform: 'translate(14px, -6px) scale(0.75)', 
              },
            }}
            label="Purchase Link"
            type="url"
            value={newItem.url || ''}
            onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
            fullWidth
          />

          <Button
            sx={{
              mt: 3,
              borderRadius: '25px', 
              padding: '10px', 
              background: isFormValid()
                ? 'linear-gradient(135deg, #8d8aee, #5651e5)' 
                : 'none', 
              color: isFormValid() ? '#fff' : '#808080', 
              textTransform: 'none',
              border: isFormValid() ? 'none' : '2px solid #5651e5', 
              '&:hover': {
                background: isFormValid()
                  ? 'linear-gradient(135deg, #5651e5, #343188)' 
                  : 'none', 
              },
              '&:disabled': {
                color: '#808080',
                border: '2px solid #5651e5', 
                background: 'none', 
              },
            }}
            type="submit"
            variant="contained"
            fullWidth
            disabled={!isFormValid()} 
          >
          Create
        </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItemDialog;