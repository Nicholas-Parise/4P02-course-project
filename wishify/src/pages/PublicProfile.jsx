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
      <div className="profile-header flex flex-col md:flex-row gap-[10px]">
        <div className="profile-picture w-full mb-[20px] sm:mb-0 sm:w-[25%]">
          <img
            src={
              user.user.picture
            }
            alt="User profile picture"
          />
        </div>

        <div className="profile-header-fields">
          <div className="profile-settings-item">
            <div className='profile-setting-displayname flex justify-center md:justify-start items-center'>
              {user.user.displayname}
              {user.user.pro && (
                <>
                  &nbsp;
                  <span className='pro-badge' style={{verticalAlign: 'middle'}}>PRO</span>
                </>
              )}
            </div>
            </div>
          
          {user.user.bio && (
          <>
            <hr />

            <div className='profile-setting-value text-base md:text-lg'>
              {user.user.bio}
            </div>
          </>
          )}
        </div>
      </div>

      <hr />

      <div className="profile-content">
        
        <div className="profile-settings-item">
          
          <div className='profile-setting-label mb-2'>
            Likes:
          </div>

          <div className='profile-setting-value'>
            <ul className="max-w-xl grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-1">
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
          <div className='profile-setting-label mb-2'>
            Dislikes:
          </div>

          <div className='profile-setting-value'>
            <ul className="max-w-xl grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-1">
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