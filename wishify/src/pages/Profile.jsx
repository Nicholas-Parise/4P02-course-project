import React from 'react';
import '../profile.css';
import SettingsItem from '../components/SettingsItem.jsx';
import LikesSettingsItem from '../components/LikesSettingsItem.jsx';
import {
  EditDisplayNameModal,
  EditBioModal,
  EditEmailModal,
  EditPasswordModal,
  DeleteAccountModal,
  AddLikesModal,
} from '../components/ProfileSettingModals';

const Profile = () => {
  const [user, setUser] = React.useState({
    profilePictureURL: '',
    displayName: 'John Doe',
    biography: 'I like copilot.',
    email: 'johndoe@wishify.com',
    likes: [],
    dislikes: ['Books'],
  });

  // Modal setup
  const [openModals, setOpenModals] = React.useState({
    displayName: false,
    biography: false,
    email: false,
    password: false,
    likes: false,
    dislikes: false,
    deleteAccount: false,
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

  const handleClose = () =>
    setOpenModals({
      displayName: false,
      biography: false,
      email: false,
      password: false,
      likes: false,
      deleteAccount: false,
    });

  const handleSave = (value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [currentField]: value,
    }));
  };

  const handleSaveLikes = (value, type) => {
    setUser((prevUser) => ({
      ...prevUser,
      [type]: value,
    }));
  };

  return (
    <div className="profile-page-container">
      <section className="profile-container">
        <h1>Profile settings</h1>

        {/* Profile header */}
        <div className="profile-header">
          <div className="profile-picture">
            <img
              src={
                user.profilePicture ||
                'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1738333167~exp=1738336767~hmac=d1a2645bf22eff4e35bc060e5a7529cb9cbf09696ae232ab6690c137ad06d5e4&w=1060'
              }
              alt="User profile picture"
            />
            <button>Update Picture</button>
          </div>

          <div className="profile-header-fields">
            {/* Display Name Field */}
            <SettingsItem
              label="Display Name:"
              values={user.displayName}
              buttonText={'Edit'}
              onEdit={() => handleOpenModal('displayName')}
            />

            {/* Email Field */}
            <SettingsItem
              label="Email:"
              values={user.email}
              buttonText={'Edit'}
              onEdit={() => handleOpenModal('email')}
            />
          </div>
        </div>

        <hr />

        {/* Rest of the content */}
        <div className="profile-content">
          <SettingsItem
            label="Biography:"
            values={user.biography}
            buttonText={'Edit'}
            onEdit={() => handleOpenModal('biography')}
          />

          <LikesSettingsItem
            label="Likes:"
            values={user.likes}
            onEdit={() => handleOpenModal('likes')}
            onSave={handleSaveLikes}
          />

          <LikesSettingsItem
            label="Dislikes:"
            values={user.dislikes}
            onEdit={() => handleOpenModal('dislikes')}
            onSave={handleSaveLikes}
          />

          <div className="button-container">
            <button
              className="delete-account-button"
              style={{
                border: '2px solid red',
                color: 'red',
                background: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background 0.3s ease, color 0.3s ease',
                width: '50%',
              }}
              onClick={() => handleOpenDeleteAccountModal()}
            >
              Delete Account
            </button>
            
            <button
              className="change-password-button"
              style={{
                background: 'linear-gradient(135deg, #8d8aee, #5651e5)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background 0.3s ease',
                width: '50%',
              }}
              onClick={() => handleOpenPasswordModal()}
            >
              Change Password
            </button>
          </div>
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
          type="Likes"
          onSave={handleSave}
          handleClose={handleClose}
        />

        <AddLikesModal
          open={openModals.dislikes}
          values={currentValue}
          type="Dislikes"
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
  );
};

export default Profile;