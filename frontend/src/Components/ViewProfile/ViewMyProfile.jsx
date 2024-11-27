import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import NavBar from '../Navbar/Navbar';
import defaultImage from './default-image-url.jpg';
import './ViewMyProfile.css';

const getUserDataFromCookies = () => {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === 'user_data') {
      return value;
    }
  }
  return null;
};

const ViewMyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [editedUserData, setEditedUserData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const UserID = getUserDataFromCookies();

  const UserProfilePicture =
    userData && userData.profileImage
      ? `http://127.0.0.1:5001/uploads/${userData.profileImage.split("\\").pop()}`
      : defaultImage;

  useEffect(() => {
    const fetchUserData = async () => {
      if (UserID) {
        try {
          const response = await fetch(`/get_user_info?user_id=${UserID}`, {
            method: 'GET',
            credentials: 'include',
          });
          const data = await response.json();
          if (data.success) {
            setUserData(data.user);
            setEditedUserData(data.user);
          } else {
            console.error('Error fetching user data:', data.message);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [UserID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData({ ...editedUserData, [name]: value });
  };

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('id', UserID);
      formData.append('name', editedUserData.name);
      formData.append('surname', editedUserData.surname);
      formData.append('email', editedUserData.email);
      formData.append('phone', editedUserData.phone);
      formData.append('password', editedUserData.password || '');

      if (editedUserData.profileImageFile) {
        formData.append('photo', editedUserData.profileImageFile);
      }

      const response = await fetch('/update_user_data', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSnackbarMessage('Profil başarıyla güncellendi!');
        setSnackbarOpen(true);
        setIsModalOpen(false);
        setUserData({ ...editedUserData, profileImage: data.profileImage });
      } else {
        console.error('Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedUserData({ ...editedUserData, profileImageFile: file });
    }
  };

  const handleCancel = () => {
    setEditedUserData({ ...userData });
    setIsModalOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const renderModal = () => (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Profile</h2>
        <div className="profile-image-container">
          <img src={UserProfilePicture} alt="User" className="modal-profile-image" />
          <input type="file" onChange={handleImageChange} />
        </div>
        <form>
          <label>
            Name:
            <input type="text" name="name" value={editedUserData.name || ''} onChange={handleInputChange} />
          </label>
          <label>
            Surname:
            <input type="text" name="surname" value={editedUserData.surname || ''} onChange={handleInputChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={editedUserData.email || ''} onChange={handleInputChange} />
          </label>
          <label>
            Phone:
            <input type="text" name="phone" value={editedUserData.phone || ''} onChange={handleInputChange} />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={editedUserData.password || ''}
              placeholder="Change password (optional)"
              onChange={handleInputChange}
            />
          </label>
          <div className="buttons-container">
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" onClick={handleProfileUpdate}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      <NavBar />
      <div className="profile-card">
        {userData ? (
          <div className="profile-details">
            <div className="profile-image-container">
              <img src={UserProfilePicture} alt="User Profile" className="profile-image" />
            </div>
            <div className="profile-text">
              <h2>
                {userData.name} {userData.surname}
              </h2>
              <p>
                <strong>Total Points:</strong> {userData.points || '25'}
              </p>
              <p>
                <strong>Gender:</strong> {userData.gender}
              </p>
              <p>
                <strong>Birth Date:</strong> {userData.birthdate}
              </p>
              <h3>Contact Information</h3>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Phone:</strong> {userData.phone}
              </p>
              <button onClick={() => setIsModalOpen(true)}>Edit Profile</button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        {isModalOpen && renderModal()}
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default ViewMyProfile;
