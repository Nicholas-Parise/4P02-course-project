import React from 'react'


const SettingsItem = ({ label, values, isPro, buttonText, onEdit }) => {

  return (
    <>
      <div className="profile-settings-item grid grid-cols-1 sm:grid-cols-1 gap-2">
        <div className="col-span-1">
          <div className='profile-setting-label'>
            {label}
          </div>
        </div>

        <div className="col-span-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className='profile-setting-value text-base md:text-lg'>
            {values}
            {isPro && (
              <>
                &nbsp;
                <span className='pro-badge' style={{verticalAlign: 'middle'}}>PRO</span>
              </>
            )}
          </div>
        

          <div className='profile-setting-button text-left sm:text-right'>
            <button onClick={onEdit}>{buttonText}</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingsItem