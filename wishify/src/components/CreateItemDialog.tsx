import { useState, type ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, Select, SelectChangeEvent, InputLabel, FormControl, Button, MenuItem, TextField, IconButton } from '@mui/material';
import { Wishlist, WishlistItem } from '../types/types';
import { FaTimes } from 'react-icons/fa';

interface Props {
    open: boolean, 
    setOpen: (state: boolean)=>void,
    image: string | null,
    setImage: (state: string) => void
    newItem: Partial<WishlistItem>
    setNewItem: (state: Partial<WishlistItem>) => void
    wishlists: Wishlist[]
    token: string,
}

const CreateItemDialog = ({ open, setOpen, image, setImage, newItem, setNewItem, wishlists, token }: Props) => {
    const [selectedWishlist, setSelectedWishlist] = useState<string>('')

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setImage(reader.result as string)
            setNewItem({ ...newItem, picture: file })
          }
          reader.readAsDataURL(file)
        }
    }

    const createItem = (e: FormEvent) => {
        e.preventDefault();
        const url = "https://api.wishify.ca/items"

        let data = new FormData()
        data.append("name", newItem.name || "");
        data.append("description", newItem.description || "");
        data.append("url", newItem.url || "");
        data.append("picture", newItem.picture || "");
        data.append("quantity", newItem.quantity?.toString() || "1");
        data.append("price", newItem.price?.toString() || "");
        data.append("wishlists_id", selectedWishlist.toString());

        fetch(url, {
            method: 'post',
            headers: new Headers({
                'Authorization': "Bearer "+token,
                'Accept': 'application/json'
            }),
            body: data
        })
        .then((response) => response.json())
        .then((data) => {
            let id = localStorage.getItem('id')
            setOpen(false)
            console.log(data)
            console.log(id)
            if(id!=undefined && data.item.wishlists_id == id){
                window.location.reload()
            }
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
                    maxWidth: '900px',
                },
            }}
        >
            <DialogTitle id="item-dialog-title" className="text-[#5651e5] relative">
                <div className="text-center font-bold">Add New Item</div>
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
                    Enter the details for the new wishlist item.
                </DialogContentText>
                
                <form autoComplete="off" onSubmit={createItem}>
                    <div className="grid gap-4 py-4">
                        <FormControl fullWidth>
                            <InputLabel id="wishlist-select" className="text-[#5651e5]">
                                Wishlist
                            </InputLabel>
                            <Select 
                                labelId="wishlist-select" 
                                label="Wishlist"
                                value={selectedWishlist}
                                required
                                onChange={(event: SelectChangeEvent) => setSelectedWishlist(event.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#a5a2f3',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#8d8aee',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#5651e5',
                                        },
                                    },
                                }}
                            >
                                {wishlists.length > 0 && wishlists.filter(w => w.owner).map(wishlist => {
                                    return <MenuItem key={wishlist.id} value={wishlist.id}>{wishlist.name}</MenuItem>
                                })}
                            </Select>
                        </FormControl>

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

                        <div className="flex gap-2">
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
                                Create
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateItemDialog