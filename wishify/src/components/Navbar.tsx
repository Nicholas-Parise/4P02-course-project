import { useState, ReactNode } from 'react'
import { NavLink } from "react-router-dom";
import { Wishlist } from '../types/types';
import { WishlistItem } from '../types/types';
import CreateItemDialog from './CreateItemDialog';

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

  const openModal = () => {
    setNewItem({})
    setImagePreview(null)
    setIsModalOpen(true)
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

      <CreateItemDialog 
        open={isModalOpen} 
        setOpen={setIsModalOpen} 
        image={imagePreview}
        setImage={setImagePreview} 
        newItem={newItem}
        setNewItem={setNewItem}
        wishlists={wishlists}
        token={token}
      />
    </>
  )
}

export default Navbar


