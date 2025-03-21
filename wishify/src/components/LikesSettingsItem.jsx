import React from 'react'
import { Add, RemoveCircleOutline } from '@mui/icons-material'

const LikesSettingsItem = ({ label, values, onEdit, onSave }) => {

  const [items, setItems] = React.useState([])
  const [editing, setEditing] = React.useState(false)

  React.useEffect(() => {
    setItems(values)
  }, [values])

  const toggleEditing = () => setEditing(!editing)

  const onDelete = (index) => {
    setItems((prevItems) => {
      const newValues = prevItems.filter((_, i) => i !== index);
      onSave(newValues, label.slice(0, -1).toLowerCase());
      return newValues;
    });
  }

  return (
    <>
      <div className="profile-settings-item">

        <div className='profile-setting-label'>
          {label}
        </div>

        <div className='profile-setting-value'>
          <ul className="max-w-xl mx-auto columns-1 sm:columns-1 md:columns-2 lg:columns-3 space-y-2">
            {items.map((value, index) => (
              <li 
                className='likes-list-item'
                  key={index}
                  style={{
                    backgroundColor: label === "Likes:" ? "#c2f3d1" : "#f3c2c2",
                    position: 'relative',
                    overflow: 'visible'
                }}
              >
                {value}

                {/* Delete button (appears only in editing mode) */}
                {editing && (
                  <button
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: '#5651e5',
                      border: 'none',
                      borderRadius: '50%',
                      width: '15px',
                      height: '15px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      color: 'white',
                      margin: '0px'
                    }}
                    onClick={() => onDelete(index)} // Call onDelete with the item's index
                  >
                    <RemoveCircleOutline />
                  </button>
                )}
              </li>
            ))}
            {items.length < 12 && editing ? (
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