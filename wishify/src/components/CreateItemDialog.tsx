import { useState, type ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, Select, SelectChangeEvent, InputLabel, FormControl, Button, MenuItem, TextField } from '@mui/material';
import { Wishlist, WishlistItem } from '../types/types';

interface Props {
    open: boolean, 
    setOpen: (state: boolean)=>void,
    image: string | null,
    setImage: (state: string) => void
    newItem: Partial<WishlistItem>
    setNewItem: (state: Partial<WishlistItem>) => void
    wishlists: Wishlist[]
    token: string
}

const CreateItemDialog = ({ open, setOpen, image, setImage, newItem, setNewItem, wishlists, token }: Props) => {

    const [selectedWishlist, setSelectedWishlist] = useState<string>('')

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setImage(reader.result as string)
            setNewItem({ ...newItem, image: reader.result as string })
          }
          reader.readAsDataURL(file)
        }
      }

    const createItem = (e: FormEvent) => {
        e.preventDefault();

        const url = "https://api.wishify.ca/items"

        fetch(url, {
        method: 'post',
        headers: new Headers({
            'Authorization': "Bearer "+token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            name: newItem.name,
            description: newItem.description || "",
            url: newItem.url || "",
            image: image || "", // TODO UPLOAD IMAGE SOMEHOW
            quantity: newItem.quantity,
            price: newItem.price,
            wishlists_id: Number(selectedWishlist)
        })
        })
        .then((response) => response.json())
        .then((data) => {
            setOpen(false)
            console.log(data);
        })
        .catch((error) => {
            console.log(error)
        })
    }


  return (
    <Dialog 
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="item-dialog-title"
        aria-describedby="item-dialog-description"
      >
        <DialogTitle id="item-dialog-title">
            Add New Item
        </DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
            <DialogContentText id="item-dialog-description">
              Enter the details for the new wishlist item.
            </DialogContentText>
            
            <form autoComplete="off" onSubmit={createItem}>
              <FormControl sx={{ width: '25ch' }}>
                <InputLabel sx={{mt: 3}} id="wishlist-select" required>Wishlist</InputLabel>
                <Select 
                  sx={{mt: 3}}
                  className='space-y-2'
                  labelId="wishlist-select" 
                  label="Wishlist"
                  value={selectedWishlist}
                  required
                  onChange={(event: SelectChangeEvent) => setSelectedWishlist(event.target.value)}
                >
                  {wishlists.map(wishlist => {
                    return <MenuItem key={wishlist.id} value={wishlist.id}>{wishlist.name}</MenuItem>
                  })}
                </Select>

                
                <TextField
                  sx={{mt: 3}}
                  type="file"
                  slotProps={{htmlInput: { accept: 'image/*' }, inputLabel:{shrink: true}}}
                  fullWidth
                  label="Upload Image"
                  onChange={handleImageUpload}
                />
                {image && (
                <div className="mt-2 relative">
                  <img
                    src={image}
                    alt="Item preview"
                    className="rounded-md"
                  />
                </div>
                )}
                

                <TextField 
                  sx={{mt: 3}}
                  label="Name" 
                  value={newItem.name || ""} 
                  onChange={e => setNewItem({ ...newItem, name: e.target.value})}
                  required
                />

                <TextField 
                  sx={{mt: 3}}
                  label="Description" 
                  multiline
                  value={newItem.description || ""} 
                  onChange={e => setNewItem({ ...newItem, description: e.target.value})}
                />

                <TextField 
                  sx={{mt: 3}}
                  type='number'
                  label="Price" 
                  value={newItem.price || ""} 
                  required
                  onChange={e => {
                    let price = Number(e.target.value)
                    if(price < 0) price = 0
                    setNewItem({ ...newItem, price: price})
                  }}
                />

                <TextField
                  sx={{mt: 3}}
                  value={newItem.quantity || ""}
                  className="w-25"
                  label="Quantity"
                  type='number'
                  required
                  onChange={e => {
                    let quantity = Number(e.target.value)
                    if(quantity < 0) quantity = 0
                    setNewItem({ ...newItem, quantity: quantity})
                  }}
                />

                <TextField 
                  sx={{mt: 3}}
                  label="Purchase Link" 
                  type='url'
                  value={newItem.url || ""} 
                  onChange={e => setNewItem({ ...newItem, url: e.target.value})}
                />


                <Button sx={{mt: 3}} type="submit" variant="contained">Create</Button>

              </FormControl>
            </form>
            
            

            
        </DialogContent>
      </Dialog>
  )
}

export default CreateItemDialog