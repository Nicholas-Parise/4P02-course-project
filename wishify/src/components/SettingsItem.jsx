import React from 'react';

const SettingsItem = ({ label, values, buttonText, onEdit, buttonStyle }) => {
  return (
    <>
      <div className="profile-settings-item">
        <div className='profile-setting-label'>
          {label}
        </div>

        <div className='profile-setting-value'>
          {values}
        </div>

        <div className='profile-setting-button'>
          <button onClick={onEdit} style={buttonStyle}>{buttonText}</button>
        </div>
      </div>

      <hr />
    </>
  );
};

export default SettingsItem;