import React from 'react'
import '../profile.css'

const Profile = () => {
  const [user, setUser] = React.useState({
    profilePictureURL: "",
    username: "JohnDoe",
    email: "johndoe@wishify.com",
    password: "password1234",
    dependents: ["Alice", "Bob"],
    likes: ["Books", "Blu-rays"],
    dislikes: ["Cleaning Supplies"]
  })

  const [isEditing, setIsEditing] = React.useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }))
  }

  const handleEdit = () => setIsEditing(prevIsEditing => !prevIsEditing)

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const imageURL = URL.createObjectURL(file)
      setUser(prevUser => ({
        ...prevUser,
        profilePictureURL: imageURL
      }))
    }
  }

  // TODO: Input validation

  return (
    <section className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-picture">
        <img
          src={user.profilePicture || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1738333167~exp=1738336767~hmac=d1a2645bf22eff4e35bc060e5a7529cb9cbf09696ae232ab6690c137ad06d5e4&w=1060"}
          alt='User profile picture'
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
        )}
      </div>

      <div className='profile-details'>
        <label>Username:</label>
        {isEditing ? (
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
        ) : (
          <p>{user.username}</p>
        )}

        <label>Email:</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        ) : (
          <p>{user.email}</p>
        )}

        <label>Password:</label>
        {isEditing ? (
          <input 
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        ) : (
          <p>********</p>
        )}

        <label>Dependents:</label>
        {isEditing ? (
          <input
            type="text"
            name="dependents"
            value={user.dependents.join(", ")}
            onChange={(event) => setUser({
              ...user,
              dependents: event.target.value.split(", ") 
            })}
          />
        ) : (
          <p>{user.dependents.join(", ")}</p>
        )}

        <label>Likes:</label>
        {isEditing ? (
          <input
            type="text"
            name="likes"
            value={user.likes.join(", ")}
            onChange={(event) => setUser({
              ...user,
              likes: event.target.value.split(", ")
            })}
          />
        ) : (
          <p>{user.likes.join(", ")}</p>
        )}

        <label>Dislikes:</label>
          {isEditing ? (
            <input
              type="text"
              name="dislikes"
              value={user.dislikes.join(", ")}
              onChange={(event) => setUser({
                ...user,
                dislikes: e.target.value.split(", ")
              })}
            />
        ) : (
          <p>{user.dislikes.join(", ")}</p>
        )}
      </div>

      <button onClick={handleEdit}>{isEditing ? "Save" : "Edit Profile"}</button>
    </section>
  )
}

export default Profile