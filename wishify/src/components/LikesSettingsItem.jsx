import React from 'react'
import { Add, RemoveCircleOutline } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'

const LikesSettingsItem = ({ label, values, onEdit, onDelete }) => {

  const [items, setItems] = React.useState([])
  const [editing, setEditing] = React.useState(false)

  React.useEffect(() => {
    setItems(values)
  }, [values])

  const toggleEditing = () => setEditing(!editing)

  const displayAddButton = () => {
    const itemsLeft = 12 - items.filter(item => (label === "Likes:" ? item.love : !item.love)).length
    return itemsLeft > 0 && editing
  }

  return (
    <>
      <div className="profile-settings-item">

        <div className='profile-setting-label'>
          {label}
        </div>

        <div className='profile-setting-value'>
          <ul className="max-w-xl mx-auto columns-1 sm:columns-1 md:columns-2 lg:columns-3 space-y-2">
            {items
              .filter(item => (label === "Likes:" ? item.love : !item.love)) // Filter items based on if it's a like or dislike
              .sort((a, b) => a.name.localeCompare(b.name)) // Sort items alphabetically
              .map((item) => (
              <li 
                className='likes-list-item'
                  key={item.id}
                  style={{
                    backgroundColor: label === "Likes:" ? "#c2f3d1" : "#f3c2c2",
                    position: 'relative',
                    overflow: 'visible'
                }}
              >
                {item.name}

                {/* Delete button (appears only in editing mode) */}
                {editing && (
                  <button
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      // background: '#5651e5',
                      border: 'none',
                      borderRadius: '50%',
                      width: '15px',
                      height: '15px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      color: '#5651e5',
                      margin: '0px',
                    }}
                    onClick={() =>  onDelete(item.id)} 
                  >
                    <DeleteIcon fontSize='small' />
                  </button>
                )}
              </li>
            ))}
            {displayAddButton() ? (
              <li>
                <button id={label === "Likes:" ? "add-likes-button" : "add-dislikes-button"} onClick={onEdit}>{<Add />}</button>
              </li>
            ) : null}
          </ul>
        </div>

        <div className='profile-setting-button'>
          <button onClick={toggleEditing}>{(editing ? "Done" : "Edit")}</button>
        </div>

      </div>

      <hr />
    </>
  )
}

export default LikesSettingsItem