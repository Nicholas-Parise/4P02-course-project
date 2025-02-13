import React from 'react'

const SettingsItem = ({ label, values, buttonText, onEdit, isList }) => {
  console.log(label, typeof label)
  return (
    <>
      <div className="profile-settings-item">
        <div className='profile-setting-label'>
          {label}
        </div>

        <div className='profile-setting-value'>
          {isList ? (
            <ul className="max-w-xl mx-auto columns-1 sm:columns-1 md:columns-2 lg:columns-3 space-y-2">
              {values.map((value, index) => (
                <li key={index} style={{backgroundColor: label === "Likes:" ? "#c2f3d1" : "#f3c2c2"}}>
                  {value}
                </li>
              ))}
            </ul>
          ) : values}
        </div>

        <div className='profile-setting-button'>
          <button onClick={onEdit}>{buttonText ? buttonText : "Edit"}</button>
        </div>
      </div>

      <hr />
    </>
  )
}

export default SettingsItem