import React from 'react'
import '../profile.css'
import SettingsItem from '../components/SettingsItem.jsx'

const Profile = () => {
  const [user, setUser] = React.useState({
    profilePictureURL: "",
    displayName: "John Doe",
    biography: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.",
    email: "johndoe@wishify.com",
    password: "password1234",
    likes: ["Books", "Blu-rays", "Video games", "item 4", "item 5", "item 6", "item 7", "item 8adsaadfjk", "item 9", "item 10", "item 11", "item 12"],
    dislikes: ["Cleaning Supplies"]
  })

  // TODO: Input validation
  // max chars per item
  // maximum of 12 likes and 12 dislikes
  // password: min 8 chars, at least one of each (uppercase letter, lowercase letter, symbol, number)
  // strength of password indicator?


  return (
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
        onEdit={() => {console.log("Edit display name.")}}
      />

      <SettingsItem
        label="Biography:"
        values={user.biography}
        onEdit={() => {console.log("Edit bio.")}}
      />

      <SettingsItem
        label="Likes:"
        values={user.likes}
        buttonText='Add/Remove'
        onEdit={() => {console.log("Edit likes.")}}
        isList={true}
      />

      <SettingsItem
        label="Dislikes:"
        values={user.dislikes}
        buttonText='Add/Remove'
        onEdit={() => {console.log("Clicked!")}}
        isList={true}
      />

      <SettingsItem
        label='Email address:'
        values={[user.email]}
        buttonText='Edit'
        onEdit={() => {console.log("Edit email.")}}
      />

      <SettingsItem
        label='Password:'
        values={['Password strength: weak']}
        buttonText='Change Password'
        onEdit={() => {console.log("Edit password.")}}
      />

      <button
        className='delete-account-button'
        style={{color: 'red'}}
        onClick={() => {}}
        >Delete account
      </button>
    </section>
  )
}

export default Profile