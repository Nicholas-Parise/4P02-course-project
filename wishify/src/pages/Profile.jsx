import React from 'react';
import '../profile.css';
import SettingsItem from '../components/SettingsItem.jsx';
import LikesSettingsItem from '../components/LikesSettingsItem.jsx';
import { EditDisplayNameModal, EditBioModal, EditEmailModal, EditPasswordModal, DeleteAccountModal, AddLikesModal } from '../components/ProfileSettingModals';

const Profile = () => {
  const [user, setUser] = React.useState({
    profilePictureURL: "",
    displayName: "John Doe",
    biography: "I like copilot.",
    email: "johndoe@wishify.com",
    likes: [],
    dislikes: ["Books"]
  });

  const [openModals, setOpenModals] = React.useState({
    displayName: false,
    biography: false,
    email: false,
    password: false,
    likes: false,
    dislikes: false,
    deleteAccount: false
  });

  const [currentField, setCurrentField] = React.useState('');
  const [currentValue, setCurrentValue] = React.useState('');

  const handleOpenModal = (field) => {
    setCurrentField(field);
    setCurrentValue(user[field]);
    setOpenModals((prev) => ({ ...prev, [field]: true }));
  };

  const handleOpenPasswordModal = () => {
    setCurrentField('password');
    setOpenModals((prev) => ({ ...prev, password: true }));
  };

  const handleOpenDeleteAccountModal = () => {
    setCurrentField('deleteAccount');
    setOpenModals((prev) => ({ ...prev, deleteAccount: true }));
  };

  const handleClose = () => setOpenModals({
    displayName: false,
    biography: false,
    email: false,
    password: false,
    likes: false,
    deleteAccount: false
  });

  const handleSave = (value) => {
    setUser((prevUser) => ({
      ...prevUser, [currentField]: value
    }));
  };

  const handleSaveLikes = (value, type) => {
    setUser((prevUser) => ({
      ...prevUser, [type]: value
    }));
  };

  return (
    <>
      <style>
        {`
          .delete-account-button:hover {
            background-color:#ffe6e6 !important;
            text-decoration: none !important;
          }
          .change-password-button:hover {
            background-color:rgb(102, 102, 247) !important;
            text-decoration: none !important;
          }
        `}
      </style>

      <div className="profile-wrapper">
        <section className="profile-container">

          <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Profile settings</h2>

          <div className="profile-top-section">
            <div className="profile-picture">
              <img
                src={user.profilePicture || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1738333167~exp=1738336767~hmac=d1a2645bf22eff4e35bc060e5a7529cb9cbf09696ae232ab6690c137ad06d5e4&w=1060"}
                alt='User profile picture'
              />
              <button>Update Picture</button>
            </div>

            <div className="profile-details">
              <SettingsItem
                label='Display name:'
                values={user.displayName}
                buttonText={'Edit'}
                onEdit={() => handleOpenModal("displayName")}
                buttonStyle={{ color: '#5651e5', fontWeight: 'bold' }}
              />

              <SettingsItem
                label='Email address:'
                values={[user.email]}
                buttonText='Edit'
                onEdit={() => handleOpenModal("email")}
                buttonStyle={{ color: '#5651e5', fontWeight: 'bold' }}
              />
            </div>
          </div>

          <hr />

          <SettingsItem
            label="Biography:"
            values={user.biography}
            buttonText={'Edit'}
            onEdit={() => handleOpenModal("biography")}
            buttonStyle={{ color: '#5651e5', fontWeight: 'bold' }}
          />

          <div className="likes-dislikes-container">
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
          </div>

          <div className="button-container">
            <button
              className="delete-account-button"
              style={{
                width: '100%',
                padding: '15px',
                textAlign: 'center',
                border: '1px solid red',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'background-color 0.3s ease',
                color: 'red'
              }}
              onClick={() => handleOpenDeleteAccountModal()}
            >
              Delete account
            </button>

            <button
              className="change-password-button"
              style={{
                width: '100%',
                padding: '15px',
                textAlign: 'center',
                border: '1px solid #5651e5',
                background: '#5651e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'background-color 0.3s ease',
                color: 'white'
              }}
              onClick={() => handleOpenPasswordModal()}
            >
              Change Password
            </button>
          </div>

          <EditDisplayNameModal
            open={openModals.displayName}
            value={currentValue}
            onSave={handleSave}
            handleClose={handleClose}
          />

          <EditBioModal
            open={openModals.biography}
            value={currentValue}
            onSave={handleSave}
            handleClose={handleClose}
          />

          <AddLikesModal
            open={openModals.likes}
            values={currentValue}
            type='Likes'
            onSave={handleSave}
            handleClose={handleClose}
          />

          <AddLikesModal
            open={openModals.dislikes}
            values={currentValue}
            type='Dislikes'
            onSave={handleSave}
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
            onSave={handleSave}
            handleClose={handleClose}
          />

          <DeleteAccountModal
            open={openModals.deleteAccount}
            onSave={handleSave}
            handleClose={handleClose}
          />
        </section>
      </div>
    </>
  );
};

export default Profile;