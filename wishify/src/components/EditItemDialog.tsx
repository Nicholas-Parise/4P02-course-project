import { useState, type ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, FormControl, Button, TextField } from '@mui/material';
import { WishlistItem } from '../types/types';

interface Props {
    open: boolean, 
    setOpen: (state: boolean) => void,
    item: WishlistItem,
    editWishlistItem: (item: WishlistItem) => void,
}

const EditItemDialog = ({ open, setOpen, item, editWishlistItem, }: Props) => {
    const token = localStorage.getItem('token') || ''
    const [image, setImage] = useState<string>(item.image)
    const [newItem, setNewItem] = useState<WishlistItem>(item)

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setImage(reader.result as string)
            setNewItem({ ...newItem, picture: file, image: reader.result as string })
          }
          reader.readAsDataURL(file)
        }
      }

    const editItem = (e: FormEvent) => {
        e.preventDefault();

        const editUrl = `https://api.wishify.ca/items/${newItem.id}`
        const imageUrl = `https://api.wishify.ca/items/upload/${newItem.id}`
        let newImage = ""

        let data = new FormData()
        data.append("picture", newItem.picture || "");
        // Update Image
        fetch(imageUrl, {
          method: 'post',
          headers: new Headers({
              'Authorization': "Bearer "+token,
              'Accept': 'application/json'
          }),
          body: data
          })
          .then((response) => response.json())
          .then((data) => {
              setOpen(false)
              newImage = data.imageUrl
          })
          .catch((error) => {
              console.log(error)
          })

        // Update Item Data
        fetch(editUrl, {
            method: 'put',
            headers: new Headers({
                'Authorization': "Bearer "+token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                name: newItem.name,
                description: newItem.description || "",
                url: newItem.url || "",
                quantity: newItem.quantity,
                price: newItem.price,
            })
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(newImage)
            editWishlistItem({...data.item, image: newImage})
            setOpen(false)
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
                Edit Item
            </DialogTitle>
            <DialogContent className="sm:max-w-[425px]">
                <DialogContentText id="item-dialog-description" sx={{ color: '#000' }}>
                  Modify the details of this item.
                </DialogContentText>
                
                <form autoComplete="off" onSubmit={editItem}>
                  <FormControl sx={{ width: '25ch' }}>
                   <TextField 
                      sx={{mt: 3}}
                      label="Name" 
                      value={newItem.name || ""} 
                      onChange={e => setNewItem({ ...newItem, name: e.target.value})}
                      required
                    />

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
    
    
                    <Button 
                      sx={{
                        mt: 3,
                        background: 'linear-gradient(to right, #8d8aee, #5651e5)',
                        color: 'white',
                        borderRadius: '25px',
                        '&:hover': { background: 'linear-gradient(to right, #5651e5, #343188)' }
                      }}  
                      type="submit" 
                      variant="contained"
                    >
                      Save
                    </Button>
    
                  </FormControl>
                </form>
                
            </DialogContent>
          </Dialog>
      )
}

export default EditItemDialog