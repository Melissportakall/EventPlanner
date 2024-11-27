import React, { useState } from 'react';
import ReactDOM from "react-dom";
import Snackbar from '@mui/material/Snackbar';
import defaultImage from './default-image-url.jpg';



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

const UserCard = ({ userData, handleLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUserData, setEditedUserData] = useState({ ...userData });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const UserID = getUserDataFromCookies();
  const UserProfilePicture = userData.profileImage
    ? `http://127.0.0.1:5001/uploads/${userData.profileImage.split("\\").pop()}`
    : defaultImage;
    console.log(UserProfilePicture);

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
      formData.append('password', editedUserData.password);

      if (editedUserData.profileImageFile) {
        formData.append('photo', editedUserData.profileImageFile);
      }

      const response = await fetch('/update_user_data', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setIsModalOpen(false);
        setSnackbarMessage('Profil başarıyla güncellendi!');
        setSnackbarOpen(true);
        setEditedUserData((prevData) => ({
          ...prevData,
          profileImage: `/static/uploads/${data.profileImage}`,
        }));
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
      setEditedUserData((prevData) => ({
        ...prevData,
        profileImageFile: file,
      }));
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
    <div
      className="modal-overlay"
      style={{
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
      onClick={handleCancel}
    >
      <div
        className="modal-content"
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: 'black', marginBottom: '15px', textAlign: 'center' }}>Edit Profile</h2>
        <div className="profile-image-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={UserProfilePicture}
            alt="User"
            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
          />
          <input
            type="file"
            onChange={handleImageChange}
            style={{ marginTop: '10px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          />
        </div>
        <form>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={editedUserData.name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Surname:
            <input
              type="text"
              name="surname"
              value={editedUserData.surname}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={editedUserData.email}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={editedUserData.phone}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={editedUserData.password || ""}
              placeholder="Change password (optional)"
              onChange={handleInputChange}
            />
          </label>
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="button" onClick={handleProfileUpdate}>Save</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="user-card">
      <img src={UserProfilePicture} alt="User" />
      <ul>
        <li><strong>Ad:</strong> {userData.name}</li>
        <li><strong>Soyad:</strong> {userData.surname}</li>
        <li><strong>Email:</strong> {userData.email}</li>
        <li><strong>Telefon:</strong> {userData.phone}</li>
        <li><strong>Cinsiyet:</strong> {userData.gender}</li>
        <li><strong>Doğum Tarihi:</strong> {userData.birthdate}</li>
      </ul>
      <button onClick={() => setIsModalOpen(true)}>Edit Profile</button>
      <button onClick={handleLogout}>Log Out</button>
      {isModalOpen && ReactDOM.createPortal(renderModal(), document.body)}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default UserCard;
