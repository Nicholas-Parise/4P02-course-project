import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
} from '@mui/material';
import { Wishlist, IdeaItem } from '../types/types';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
    p: 4,
    border: 'none',
    outline: 'none',
};

interface AddIdeaModalProps {
    open: boolean;
    onClose: () => void;
    wishlists: Wishlist[];
    onAdd: (wishlist: number, quantity: number) => void;
}

const AddIdeaModal: React.FC<AddIdeaModalProps> = ({
    open,
    onClose,
    wishlists,
    onAdd,
}) => {
    const [selectedWishlist, setSelectedWishlist] = useState('');
    const [selectedWishlistId, setSelectedWishlistId] = useState(0);
    const [quantity, setQuantity] = useState("1");
    const [validQuantity, setValidQuantity] = useState(1);

    const handleAdd = () => {
    const parsedQuantity = parseInt(quantity, 10);
    const finalQuantity = !isNaN(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1;

    setValidQuantity(finalQuantity); // Update the state for future renders

    if (selectedWishlist && finalQuantity > 0) {
        console.log(`Adding ${finalQuantity} items to ${selectedWishlist}`);
        onAdd(selectedWishlistId, finalQuantity);
        onClose();
    }
};

const handleSelectWishlist = (wishlist: string) => {
    setSelectedWishlist(wishlist);
    const selected = wishlists.find((w) => w.name === wishlist);
    if (selected) {
        setSelectedWishlistId(selected.id);
    }
}

return (
    <Modal open={open} onClose={onClose}>
        <Box sx={style}>
            <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom
            sx={{ 
                color: '#5651e5',
                fontWeight: 'bold',
                alignContent: 'center',
                textAlign: 'center',
                mb: 3   
            }}>
                Add Item to Wishlist
            </Typography>
            
            <TextField
                select
                required
                label="Choose Wishlist"
                value={selectedWishlist}
                onChange={(e) => handleSelectWishlist(e.target.value)}
                fullWidth
                margin="normal"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#5651e5',
                        },
                        '&:hover fieldset': {
                            borderColor: '#5651e5',
                        },
                    },
                    mb: 2
            }}>
                {wishlists.map((wishlist) => (
                    <MenuItem 
                    key={wishlist.id} 
                    value={wishlist.name}
                    sx={{
                        '&:hover': {
                            backgroundColor: '#5651e510',
                        }
                    }}>
                        {wishlist.name}
                        </MenuItem>
                    ))}
            </TextField>
            <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                fullWidth
                margin="normal"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#5651e5',
                        },
                        '&:hover fieldset': {
                            borderColor: '#5651e5',
                        },
                    },
                    mb: 3
            }}/>
            
            <Box mt={2} display="flex" justifyContent="space-between">
                <Button 
                variant="outlined" 
                onClick={onClose}
                sx={{
                    color: '#5651e5',
                    borderColor: '#5651e5',
                    borderRadius: '25px',
                    '&:hover': {
                        borderColor: '#4540d4',
                        backgroundColor: '#5651e510',
                    }
                }}>
                    Cancel
                </Button>
                
                <Button 
                variant="contained" 
                onClick={handleAdd}
                sx={{
                    backgroundColor: '#5651e5',
                    borderRadius: '25px',
                    '&:hover': {
                        backgroundColor: '#4540d4',
                    }
                }}>
                    Add Item
                </Button>
            </Box>
        </Box>
    </Modal>
    );
};

export default AddIdeaModal;