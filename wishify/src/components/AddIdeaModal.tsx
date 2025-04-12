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
border: '2px solid #000',
boxShadow: 24,
p: 4,
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
            <Typography variant="h6" component="h2" gutterBottom>
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
            >
                {wishlists.map((wishlist) => (
                    <MenuItem key={wishlist.id} value={wishlist.name}>
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
            />
            <Box mt={2} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={() => handleAdd()}>
                    Add
                </Button>
            </Box>
        </Box>
    </Modal>
);
};

export default AddIdeaModal;