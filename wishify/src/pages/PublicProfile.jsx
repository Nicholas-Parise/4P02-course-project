import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const PublicProfile = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`https://api.wishify.ca/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) {
          throw new Error('User not found')
        }
        const data = await response.json()
        setUser(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
        console.log(user)
      }
    }
    console.log(userId)
    if (userId) {
      fetchUser()
    }
  }
  , [userId])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!user) return <p>User not found</p>
  

  return (
    <>
    <section className="profile-container">
      <div className="profile-header">
        <div className="profile-picture">
          <img
            src={
              user.user.picture
            }
            alt="User profile picture"
          />
        </div>

        <div className="profile-header-fields">
          <div className="profile-settings-item">

            <div className='profile-setting-displayname'>
              {user.user.displayname}
            </div>

          </div>
          <hr />

          {/* <div className="profile-settings-item"> */}
            <div className='profile-setting-value'>
              {user.user.bio}
            </div>
          {/* </div> */}
        </div>
      </div>

      <hr />

      <div className="profile-content">
        
        <div className="profile-settings-item">
          
          <div className='profile-setting-label'>
            Likes:
          </div>

          <div className='profile-setting-value'>
            <ul className="max-w-xl mx-auto columns-1 sm:columns-1 md:columns-2 lg:columns-3 space-y-2">
              {user.categories
                .filter(item => item.love) // Show likes only
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort items alphabetically
                .map((item) => (
                <li 
                  className='likes-list-item'
                    key={item.id}
                    style={{
                      backgroundColor: "#c2f3d1",
                      position: 'relative',
                      overflow: 'visible'
                  }}
                >
                  {item.name}

                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="profile-settings-item">
          <div className='profile-setting-label'>
            Dislikes:
          </div>

          <div className='profile-setting-value'>
            <ul className="max-w-xl mx-auto columns-1 sm:columns-1 md:columns-2 lg:columns-3 space-y-2">
              {user.categories
                .filter(item => !item.love) // Show dislikes only
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort items alphabetically
                .map((item) => (
                <li 
                  className='likes-list-item'
                    key={item.id}
                    style={{
                      backgroundColor: "#f3c2c2",
                      position: 'relative',
                      overflow: 'visible'
                  }}
                >
                  {item.name}

                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default PublicProfile