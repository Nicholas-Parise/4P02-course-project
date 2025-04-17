import { useState, type ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, FormControl, Button, TextField, IconButton } from '@mui/material';
import { WishlistItem } from '../types/types';
import { FaTimes } from 'react-icons/fa';

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
            PaperProps={{
                style: {
                    border: '2px solid #5651e5',
                    borderRadius: '25px',
                    maxWidth: '400px',
                    width: '90%'
                },
            }}
        >
            <DialogTitle id="item-dialog-title" className="text-[#5651e5] relative">
                <div className="text-center font-bold">Edit Item</div>
                <IconButton
                    aria-label="close"
                    onClick={() => setOpen(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#5651e5',
                    }}
                >
                    <FaTimes />
                </IconButton>
            </DialogTitle>
            <DialogContent className="sm:max-w-[425px]">
                <DialogContentText id="item-dialog-description" className="text-[#5651e5] text-center">
                    Modify the details of this item.
                </DialogContentText>
                
                <form autoComplete="off" onSubmit={editItem}>
                    <div className="grid gap-4 py-4">
                        <TextField 
                            label="Name"
                            value={newItem.name || ""}
                            onChange={e => setNewItem({ ...newItem, name: e.target.value})}
                            required
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#a5a2f3',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#8d8aee',
                                    },
                                },
                            }}
                        />

                        <div>
                            <TextField
                                type="file"
                                slotProps={{htmlInput: { accept: 'image/*' }, inputLabel:{shrink: true}}}
                                fullWidth
                                label="Upload Image"
                                onChange={handleImageUpload}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#a5a2f3',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#8d8aee',
                                        },
                                    },
                                }}
                            />
                            {image && (
                              <div className="mt-2 flex items-center justify-center h-48 bg-gray-50 rounded-md">
                                <img
                                  src={image}
                                  alt="Item preview"
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            )}
                        </div>
        
                        <TextField 
                            label="Description"
                            multiline
                            rows={3}
                            value={newItem.description || ""}
                            onChange={e => setNewItem({ ...newItem, description: e.target.value})}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#a5a2f3',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#8d8aee',
                                    },
                                },
                            }}
                        />
        
                        <TextField 
                            type='number'
                            label="Price"
                            value={newItem.price || ""}
                            required
                            onChange={e => {
                                let price = Number(e.target.value)
                                if(price < 0) price = 0
                                setNewItem({ ...newItem, price: price})
                            }}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#a5a2f3',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#8d8aee',
                                    },
                                },
                            }}
                        />
        
                        <TextField
                            value={newItem.quantity || ""}
                            label="Quantity"
                            type='number'
                            required
                            onChange={e => {
                                let quantity = Number(e.target.value)
                                if(quantity < 0) quantity = 0
                                setNewItem({ ...newItem, quantity: quantity})
                            }}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#a5a2f3',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#8d8aee',
                                    },
                                },
                            }}
                        />
        
                        <TextField 
                            label="Purchase Link"
                            type='url'
                            value={newItem.url || ""}
                            onChange={e => setNewItem({ ...newItem, url: e.target.value})}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#a5a2f3',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#8d8aee',
                                    },
                                },
                            }}
                        />
        
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button 
                                fullWidth
                                className="!rounded-[25px]"
                                sx={{
                                    border: '2px solid #5651e5',
                                    color: '#5651e5',
                                    '&:hover': { background: '#EDEDFF' },
                                    padding: '8px 16px'
                                }}
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                fullWidth
                                className="!rounded-[25px] bg-gradient-to-r from-[#8d8aee] to-[#5651e5] !text-white hover:from-[#5651e5] hover:to-[#343188]"
                                sx={{
                                    padding: '8px 16px'
                                }}
                                type="submit"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditItemDialog