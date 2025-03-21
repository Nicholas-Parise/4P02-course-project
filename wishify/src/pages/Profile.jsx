import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../profile.css'
import SettingsItem from '../components/SettingsItem.jsx'
import LikesSettingsItem from '../components/LikesSettingsItem.jsx'
import { EditDisplayNameModal, EditBioModal, EditEmailModal, EditPasswordModal, DeleteAccountModal, AddLikesModal } from '../components/ProfileSettingModals'
import { CircularProgress, Typography, Snackbar, Alert } from '@mui/material'

const Profile = () => {
  const navigate = useNavigate()

  const [user, setUser] = React.useState({
    email: '',
    displayName: '',
    bio: '',
    picture: '',
    likes: []
  })

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [successMessage, setSuccessMessage] = React.useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("User not authenticated")
        setLoading(false)
        return
      }

      try {
        const response = await fetch('https://api.wishify.ca/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.status === 200) {
          const data = await response.json()
          console.log(data)
          setUser({
            email: data.user.email,
            displayName: data.user.displayname,
            bio: data.user.bio === null ? '' : data.user.bio,
            picture: data.user.picture,
            likes: data.categories
          })
          console.log(user)
        }
        else if (response.status === 404) {
          setError("User not found.")
        }
        else if (response.status === 500) {
          setError("Internal server error. Please try again later.")
        }
        else {
          setError(`An unexpected error occurred: ${response.status}`)
        }
      } catch (err) {
        setError(`An error occurred: ${err.message}`)
      }
      finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Modal setup
  const [openModals, setOpenModals] = React.useState({
    displayName: false,
    bio: false,
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
    bio: false,
    email: false,
    password: false,
    likes: false,
    dislikes: false,
    deleteAccount: false
  })

  const handleSave = async (value) => {
    try {
      const response = await fetch('https://api.wishify.ca/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [currentField]: value })
      })

      if (response.status === 400) {
        throw new Error(response.message)
      } else if (response.status === 403) {
        throw new Error(response.message)
      } else if (response.status === 404) {
        throw new Error(response.message)
      } else if (response.status === 500) {
        throw new Error("Internal server error. Please try again later.")
      } else if (!response.ok) {
        throw new Error(`An unexpected error occurred: ${response.status}`)
      }

      const data = await response.json()
      setUser(prevUser => ({
        ...prevUser, [currentField]: data.user[currentField.toLowerCase()]
      }))
    } catch (err) {
      setError(`An error occurred: ${err.message}`)
    }
  }

  const handleChangePassword = async (oldPassword, newPassword) => {
    try {
      const response = await fetch('https://api.wishify.ca/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ['password']: oldPassword, ['newPassword']: newPassword })
      })

      console.log(response)

      if (response.status === 200) {
        setSuccessMessage(true)
      } else if (response.status === 400) {
        throw new Error(response.statusText)
      } else if (response.status === 403) {
        throw new Error(response.statusText)
      } else if (response.status === 404) {
        throw new Error(response.statusText)
      } else if (response.status === 500) {
        throw new Error("Internal server error. Please try again later.")
      } else if (!response.ok) {
        throw new Error(`An unexpected error occurred: ${response.statusText}`)
      }
    } catch (err) {
      setError(`An error occurred: ${err.message}`)
    }
  }

  const handleDeleteAccount = async (password) => {
    try {
      const response = await fetch('https://api.wishify.ca/users', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ['password']: password })
      })

      console.log(password)
      console.log(response)

      if (response.status === 200) {
        setSuccessMessage(true)
        setTimeout(() => {
          localStorage.removeItem("token")
          navigate('/')
        }, 3000)
      } else if (response.status === 400) {
        throw new Error(response.statusText)
      } else if (response.status === 403) {
        throw new Error(response.statusText)
      } else if (response.status === 404) {
        throw new Error(response.statusText)
      } else if (response.status === 500) {
        throw new Error("Internal server error. Please try again later.")
      } else if (!response.ok) {
        throw new Error(`An unexpected error occurred: ${response.statusText}`)
      }
    } catch (err) {
      setError(`An error occurred: ${err.message}`)
    }
  }


  const handleSaveLikes = (value, type) => {
    setUser((prevUser) => ({
      ...prevUser, [type]: value
    }))
  }

  if (loading) return <CircularProgress />
  if (error) return <Typography variant='h6' color='error'>{error}</Typography>

  return (
    <>
      <section className="profile-container">

      <Snackbar
        open={successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessMessage(false)} severity="success" variant="filled">
          Account deleted. Redirecting to landing page...
        </Alert>
      </Snackbar>

        <h1>Profile settings</h1>

        <div className="profile-header">
          <div className="profile-picture">
            <img
              src={
                user.profilePicture ||
                'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1738333167~exp=1738336767~hmac=d1a2645bf22eff4e35bc060e5a7529cb9cbf09696ae232ab6690c137ad06d5e4&w=1060'
              }
              alt="User profile picture"
            />
            <button>Update Picture</button>
          </div>

          <div className="profile-header-fields">
            <SettingsItem
              label="Display Name:"
              values={user.displayName}
              buttonText={'Edit'}
              onEdit={() => handleOpenModal('displayName')}
            />

            <SettingsItem
              label="Email:"
              values={user.email}
              buttonText={'Edit'}
              onEdit={() => handleOpenModal('email')}
            />
          </div>
        </div>

        <hr />

      <div className="profile-content">
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

        <div className="button-container">
            <button
              className="delete-account-button"
              style={{
                border: '2px solid red',
                color: 'red',
                background: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background 0.3s ease, color 0.3s ease',
                width: '50%',
              }}
              onClick={() => handleOpenDeleteAccountModal()}
            >
              Delete Account
            </button>

            <button
              className="change-password-button"
              style={{
                background: 'linear-gradient(135deg, #8d8aee, #5651e5)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background 0.3s ease',
                width: '50%',
              }}
              onClick={() => handleOpenPasswordModal()}
            >
              Change Password
            </button>
        </div>

      <SettingsItem
        label='Display name:'
        values={user.displayName}
        buttonText={'Edit'}
        onEdit={() => handleOpenModal("displayName")}
      />

      <SettingsItem
        label="Biography:"
        values={user.bio}
        buttonText={'Edit'}
        onEdit={() => handleOpenModal("bio")}
      />

      <LikesSettingsItem
        label="Likes:"
        values={user.likes}
        onEdit={() => handleOpenModal("likes")}
        onSave={handleSaveLikes}
      />

      <LikesSettingsItem
        label="Dislikes:"
        values={user.likes}
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
        open={openModals.bio}
        value={currentValue}
        onSave={handleSave}
        handleClose={handleClose}
      />

      <AddLikesModal
        open={openModals.likes}
        values={currentValue}
        type='Likes'
        onSave={handleSaveLikes}
        handleClose={handleClose}
      />

      <AddLikesModal
        open={openModals.dislikes}
        values={currentValue}
        type='Dislikes'
        onSave={handleSaveLikes}
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
        onSave={handleChangePassword}
        handleClose={handleClose}
      />

      <DeleteAccountModal
        open={openModals.deleteAccount}
        onSave={handleDeleteAccount}
        handleClose={handleClose}
      />
    </section>
    </>
  )
}

export default Profile