import { useState, FormEvent } from "react"
import { Dialog, DialogTitle, Box, DialogContent, DialogContentText, Typography, FormControl, Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Wishlist } from "../types/types";

import { Dayjs } from "dayjs";

import pictureClothing from '/assets/clothing.jpeg';
import pictureGames from '/assets/games.jpg';
import pictureGift from '/assets/gift.jpg';
import pictureGiftbox from '/assets/giftbox.jpg';
import pictureGroceries from '/assets/groceries.jpg';
import pictureSports from '/assets/sports.jpg';
import pictureTech from '/assets/tech.jpg';

// Predefined gallery of images for wishlists
const galleryImages = [
  { id: 1, src: pictureClothing, alt: "Sports theme" },
  { id: 2, src: pictureGames, alt: "Clothing theme" },
  { id: 3, src: pictureGift, alt: "Holiday theme" },
  { id: 4, src: pictureGiftbox, alt: "Sports theme" },
  { id: 5, src: pictureGroceries, alt: "Home decor theme" },
  { id: 6, src: pictureSports, alt: "Travel theme" },
  { id: 7, src: pictureTech, alt: "Technology theme" },
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
          borderRadius: '25px', // Rounded corners
          background: '#FFFFFF', // Background color matching ProfileMenu
          padding: '20px',
          border: '2px solid #5651e5', // Border color
          maxWidth: '900px', // Set max width to 900px
          //width: '100%', // Ensure it takes full width up to the max width
        },
      }}
    >
      <DialogTitle id="item-dialog-title" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#000', fontSize: '24px' }}>
        Create New Wishlist
      </DialogTitle>
      <DialogContent className="sm:max-w-[525px]">
        <DialogContentText id="item-dialog-description" sx={{ color: '#000' }}>
          Enter the details for a new wishlist.
        </DialogContentText>
        <form autoComplete="off" onSubmit={createWishlist}>
          <FormControl>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <TextField 
                  label="Wishlist Name" 
                  value={newWishlist.name || ""} 
                  onChange={e => setNewWishlist({...newWishlist, name: e.target.value})}
                  placeholder="Name your wishlist"
                  required
                />
              </div>
              <div className="grid gap-2">
                <TextField
                  label="Wishlist Description" 
                  value={newWishlist.description || ""} 
                  onChange={(e) => setNewWishlist({...newWishlist, description: e.target.value})}
                  multiline
                />
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="grid gap-2">
                  <DatePicker
                    label="Due Date"
                    value={date}
                    onChange={(newValue: any) => setDate(newValue)}
                  />
                </div>
              </LocalizationProvider>


              <div className="grid gap-2">
                <Typography id="modal-modal-title">
                  Wishlist Image
                </Typography>
                <div className="grid grid-cols-4 gap-2">
                  {galleryImages.map((image) => (
                    <div
                      key={image.id}
                      className={ `relative cursor-pointer border-2 rounded-md overflow-hidden transition-all 
                          ${selectedImage === image.src ?
                          'border-[#5651e5] ring-2 ring-[#5651e5] ring-opacity-50'
                          :
                          'border-transparent hover:border-muted-foreground'}`
                      }
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

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                type="submit" 
                variant="contained"
                sx={{
                  background: 'linear-gradient(to right, #8d8aee, #5651e5)',
                  color: 'white',
                  borderRadius: '25px',
                  '&:hover': { background: 'linear-gradient(to right, #5651e5, #343188)' }
                }}
              >
                Create Wishlist
              </Button>
              <Button
                variant="outlined"
                onClick={() => {setOpen(false)}}
                sx={{ borderRadius: '25px', borderColor: '#5651e5', color: '#5651e5', ml: '8px' }}
              >
                Close
              </Button>
            </Box>
            
            
          </FormControl>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWishlistModal

