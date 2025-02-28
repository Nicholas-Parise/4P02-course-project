import { useState, ReactNode, type ChangeEvent, FormEvent } from 'react'
import { NavLink } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogContentText, Select, SelectChangeEvent, InputLabel, FormControl, Button, MenuItem, TextField } from '@mui/material';
import { Wishlist } from '../types/types';
import { WishlistItem } from '../types/types';

const Navbar = () => {

  interface NavItem{
    label: string,
    href: string
  }

  const [listNav] = useState([
    {'label':'Home', 'href':'/'},
    {'label':'Landing', 'href':'/landing'},
    {'label':'Wishlist', 'href':'/wishlists'},
    {'label':'Events', 'href':'/events'},
    {'label':'Login', 'href':'/login'},
    {'label':'Sign up', 'href':'/register'}
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState<string>(localStorage.getItem('token') || '')


  const [selectedWishlist, setSelectedWishlist] = useState<string>('')
  const [newItem, setNewItem] = useState<Partial<WishlistItem>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const fetchWishlists = () => {
    setToken(localStorage.getItem('token') || '')
    setLoading(true)

    if(token == ''){
      // redirect to login page
      console.log("missing token")
      return
    }

    const url = "https://api.wishify.ca/wishlists"

    fetch(url, {
      method: 'get',
      headers: new Headers({
        'Authorization': "Bearer "+token
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setWishlists(data);
        setLoading(false)
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })
      .finally(() => setLoading(false))


    return { wishlists, loading, error }
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setNewItem({ ...newItem, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const openModal = () => {
    setNewItem({})
    setImagePreview(null)
    setIsModalOpen(true)
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
        image: imagePreview || "", // TODO UPLOAD IMAGE SOMEHOW
        quantity: newItem.quantity,
        price: newItem.price,
        wishlists_id: Number(selectedWishlist)
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setIsModalOpen(false)
        console.log(data);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <>
      <div className='pr-4 pl-4 relative'>    

          <nav>
            {listNav.map((value: NavItem, key): ReactNode => {
              return <NavLink key={key} to={value.href}>{value.label}</NavLink>
            })}
          </nav>

          <button onClick={() => (fetchWishlists(), openModal())} className=' text-white bg-linear-to-r from-cyan-500 to-blue-500 pl-1.5 pr-1.5 pt-1 pb-1 rounded-lg cursor-pointer absolute top-1.5 right-3'>+ Add Item</button>


      </div>

      <Dialog 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
                {imagePreview && (
                <div className="mt-2 relative">
                  <img
                    src={imagePreview}
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
    </>
  )
}

export default Navbar


