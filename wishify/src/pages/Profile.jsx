import React from 'react'
import '../profile.css'
import SettingsItem from '../components/SettingsItem.jsx'
import Navbar from '../components/Navbar'
import LikesSettingsItem from '../components/LikesSettingsItem.jsx'
import { EditDisplayNameModal, EditBioModal, EditEmailModal, EditPasswordModal, DeleteAccountModal, AddLikesModal } from '../components/ProfileSettingModals'

const Profile = () => {
  const [user, setUser] = React.useState({
    profilePictureURL: "",
    displayName: "John Doe",
    biography: "I like copilot.",
    email: "johndoe@wishify.com",
    likes: [],
    dislikes: ["Books"]
  })

  // Modal setup
  const [openModals, setOpenModals] = React.useState({
    displayName: false,
    biography: false,
    email: false,
    password: false,
    likes: false,
    dislikes: false,
    deleteAccount: false
  })

  const [currentField, setCurrentField] = React.useState('')
  const [currentValue, setCurrentValue] = React.useState('')

  const handleOpenModal = (field) => {
    setCurrentField(field)
    setCurrentValue(user[field])
    setOpenModals((prev) => ({...prev, [field]: true}))
  }

  const handleOpenPasswordModal = () => {
    setCurrentField('password')
    setOpenModals((prev) => ({...prev, password: true}))
  }

  const handleOpenDeleteAccountModal = () => {
    setCurrentField('deleteAccount')
    setOpenModals((prev) => ({...prev, deleteAccount: true}))
  }

  const handleClose = () => setOpenModals({
    displayName: false,
    biography: false,
    email: false,
    password: false,
    likes: false,
    deleteAccount: false
  })

  const handleSave = (value) => {
    setUser((prevUser) => ({
      ...prevUser, [currentField]: value 
    }))
  }

  const handleSaveLikes = (value, type) => {
    setUser((prevUser) => ({
      ...prevUser, [type]: value
    }))
  }

  return (
    <>
      <Navbar></Navbar>
      <section className="profile-container">
        <h2>Profile settings</h2>

        <div className="profile-picture">
          <img
            src={user.profilePicture || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1738333167~exp=1738336767~hmac=d1a2645bf22eff4e35bc060e5a7529cb9cbf09696ae232ab6690c137ad06d5e4&w=1060"}
            alt='User profile picture'
          />
          <button>Update Picture</button>
        </div>

        <hr />


      <SettingsItem
        label='Display name:'
        values={user.displayName}
        buttonText={'Edit'}
        onEdit={() => handleOpenModal("displayName")}
      />

      <SettingsItem
        label="Biography:"
        values={user.biography}
        buttonText={'Edit'}
        onEdit={() => handleOpenModal("biography")}
      />

      <LikesSettingsItem
        label="Likes:"
        values={user.likes}
        onEdit={() => handleOpenModal("likes")}
        onSave={handleSaveLikes}
      />

      <LikesSettingsItem
        label="Dislikes:"
        values={user.dislikes}
        onEdit={() => handleOpenModal("dislikes")}
        onSave={handleSaveLikes}
      />

      <SettingsItem
        label='Email address:'
        values={[user.email]}
        buttonText='Edit'
        onEdit={() => handleOpenModal("email")}
      />

      <SettingsItem
        label='Password:'
        values={['********']}
        buttonText='Change Password'
        onEdit={() => handleOpenPasswordModal()}
      />

      <button
        className='delete-account-button'
        style={{color: 'red'}}
        onClick={() => handleOpenDeleteAccountModal()}
        >Delete account
      </button>

      <EditDisplayNameModal
        open={openModals.displayName}
        value={currentValue}
        onSave={handleSave}
        handleClose={handleClose}
      />

      <EditBioModal
        open={openModals.biography}
        value={currentValue}
        onSave={handleSave}
        handleClose={handleClose}
      />

      <AddLikesModal
        open={openModals.likes}
        values={currentValue}
        type='Likes'
        onSave={handleSave}
        handleClose={handleClose}
      />

      <AddLikesModal
        open={openModals.dislikes}
        values={currentValue}
        type='Dislikes'
        onSave={handleSave}
        handleClose={handleClose}
      />

      <EditEmailModal
        open={openModals.email}
        value={currentValue}
        onSave={handleSave}
        handleClose={handleClose}
      />

      <EditPasswordModal
        open={openModals.password}
        onSave={handleSave}
        handleClose={handleClose}
      />

      <DeleteAccountModal
        open={openModals.deleteAccount}
        onSave={handleSave}
        handleClose={handleClose}
      />

    </section>
    </>
  )
}

export default Profile