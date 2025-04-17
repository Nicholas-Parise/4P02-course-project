import { useState, FormEvent } from "react"
import { Dialog, DialogTitle, Box, DialogContent, DialogContentText, Typography, FormControl, Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Wishlist } from "../types/types";

import { Dayjs } from "dayjs";

import pictureGift from '/assets/gift.jpg';
import pictureSports from '/assets/sports.jpg';
import pictureTech from '/assets/tech.jpg';
import pictureWedding from '/assets/wedding.jpeg';
import pictureHome from '/assets/kitchen.jpg';
import pictureBooks from '/assets/books.jpg';
import pictureTravel from '/assets/travel.jpg';
import pictureHobby from '/assets/hobby.jpg';

// Predefined gallery of images for wishlists
const galleryImages = [
  { id: 1, src: pictureGift, alt: "Holiday Gift Theme" },
  { id: 2, src: pictureWedding, alt: "Wedding Registry Theme" },
  { id: 3, src: pictureSports, alt: "Sports Theme" },
  { id: 4, src: pictureHome, alt: "Home & Kitchen Theme" },
  { id: 5, src: pictureTech, alt: "Tech & Gadgets Theme" },
  { id: 6, src: pictureBooks, alt: "Book Lovers Theme" },
  { id: 7, src: pictureTravel, alt: "Travel & Adventure Theme" },
  { id: 8, src: pictureHobby, alt: "Hobby & Crafts Theme" },
]

interface Props {
    open: boolean, 
    setOpen: (state: boolean)=>void,
    wishlists: Wishlist[],
    setWishlists: (state: Wishlist[])=>void,
    token: string,
}

const CreateWishlistModal = ({ open, setOpen, wishlists, setWishlists, token }: Props) => {
  const [newWishlist, setNewWishlist] = useState<Partial<Wishlist>>({})
  const [date, setDate] = useState<Dayjs | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  const createWishlist = (e: FormEvent) => {
    e.preventDefault();
    
    let uniqueTitle = newWishlist.name || "";
    let counter = 1;
    if (wishlists != undefined){
      const wishlistNames = wishlists.map(wishlist => wishlist.name);
      while (wishlistNames.includes(uniqueTitle)) {
        uniqueTitle = `${newWishlist.name} (${counter})`;
        counter++;
      }
    }

    // create wishlist in the backend
    fetch("https://api.wishify.ca/wishlists", {
      method: 'post',
      headers: new Headers({
          'Authorization': "Bearer "+token,
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
          name: newWishlist.name,
          eventid: "",
          description: newWishlist.description || "",
          image: selectedImage, 
          deadline: date?.toDate()
      })
      })
      .then((response) => response.json())
      .then((data) => {
          let newWishlist: Wishlist = 
          {id: data.wishlist.id,
            event_id: 0, // TODO add event support
            name: uniqueTitle,
            description: "",
            image: ""} // TODO add descriptions
          setWishlists([...wishlists, newWishlist])
          setNewWishlist({})
      })
      .catch((error) => {
          console.log(error)
      })
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          background: '#FFFFFF',
          padding: '24px',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(86, 81, 229, 0.15)',
      }}}
    >
      <DialogTitle 
        sx={{ 
          textAlign: 'center', 
          fontWeight: 'bold', 
          color: '#5651e5',
          fontSize: '1.5rem',
          padding: '16px 0',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        Create New Wishlist
      </DialogTitle>
      
      <DialogContent sx={{ padding: '24px 0' }}>
        <DialogContentText 
          sx={{ 
            color: '#666',
            textAlign: 'center',
            marginBottom: '24px'
          }}
        >
          Enter the details for your new wishlist
        </DialogContentText>
        
        <form autoComplete="off" onSubmit={createWishlist}>
          <FormControl fullWidth>
            <div className="grid gap-6">
              <TextField 
                label="Wishlist Name" 
                value={newWishlist.name || ""} 
                onChange={e => setNewWishlist({...newWishlist, name: e.target.value})}
                placeholder="Name your wishlist"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
              
              <TextField
                label="Description (Optional)" 
                value={newWishlist.description || ""} 
                onChange={(e) => setNewWishlist({...newWishlist, description: e.target.value})}
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
              
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Due Date (Optional)"
                  value={date}
                  onChange={(newValue: any) => setDate(newValue)}
                  slotProps={{
                    textField: {
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        }
                      }
                    }
                  }}
                />
              </LocalizationProvider>

              <div>
                <Typography 
                  sx={{ 
                    color: '#5651e5',
                    fontWeight: '500',
                    marginBottom: '12px'
                  }}
                >
                  Choose a cover image
                </Typography>
                <div className="grid grid-cols-4 gap-3">
                  {galleryImages.map((image) => (
                    <div
                      key={image.id}
                      className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all 
                        ${selectedImage === image.src ?
                        'border-[#5651e5] ring-2 ring-[#5651e5] ring-opacity-50'
                        :
                        'border-transparent hover:border-[#5651e5]'}`}
                      onClick={() => setSelectedImage(image.src)}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-auto aspect-square object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '16px',
                marginTop: '24px'
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setOpen(false)}
                sx={{ 
                  borderRadius: '12px', 
                  borderColor: '#5651e5', 
                  color: '#5651e5',
                  padding: '8px 24px',
                  '&:hover': {
                    backgroundColor: '#f0f0ff',
                    borderColor: '#5651e5'
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                sx={{
                  background: 'linear-gradient(to right, #8d8aee, #5651e5)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '8px 24px',
                  boxShadow: 'none',
                  '&:hover': { 
                    background: 'linear-gradient(to right, #5651e5, #343188)',
                    boxShadow: 'none'
                  }
                }}
              >
                Create Wishlist
              </Button>
            </Box>
          </FormControl>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWishlistModal