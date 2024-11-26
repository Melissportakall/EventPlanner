import React, { useEffect, useState } from 'react';
import { LuPartyPopper } from "react-icons/lu";
import { IoChatboxEllipsesOutline, IoCreateOutline } from "react-icons/io5";
import './Card.css';
import ReactDOM from "react-dom";
import { Link, useNavigate } from 'react-router-dom';
import RandomCategoryChart from '../PieCharts/PieCharts';
import defaultImage from './default-image-url.jpg';
import Snackbar from '@mui/material/Snackbar';
import AllEvents from '../AllEvents/AllEvents';
import Navbar from '../Navbar/Navbar';

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

const MainMenu = () => {
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Main Menu';
  }, []);

  const handleLogout = () => {
    document.cookie = `user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `remember_me=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    navigate('/login');
  };

  const navItems = [
    { title: 'My Events', icon: <LuPartyPopper />, path: '/my-events' },
    { title: 'Chats', icon: <IoChatboxEllipsesOutline />, path: '/chats' },
    { title: 'Create Event', icon: <IoCreateOutline />, path: '/create-event' },
    { title: 'All Events', icon: <IoCreateOutline />, path: '/all-events' },
    { title: 'Edit Profile', icon: <IoCreateOutline />, path: '/edit-profile' },
    
  ];

  useEffect(() => {
    const userId = getUserDataFromCookies();

    if (userId) {
      fetch(`/get_user_info?user_id=${userId}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setUserData(data.user);
          } else {
            console.log(data.message);
          }
        })
        .catch(error => console.error('Error fetching user data:', error));
    } else {
      console.log("No user ID found in cookies");
    }

   
  }, []);


  
  return (
    <div style={{ color: 'white' 
      
    }}>
      <div class="container">
      <h1>Welcome!</h1>
      <h2>Special events for you!</h2>
      {userData ? (
        <UserCard userData={userData} handleLogout={handleLogout} />
      ) : (
        <p>No user data found.</p>
      )}
      </div>
      {/* Navbar */}
      <Navbar/>
     </div>
  );
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
        console.log('User data updated:', data);
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
            <h2 style={{ color: 'black', marginBottom: '15px', textAlign: 'center' }} >
              Edit Profile
            </h2>
            <div className="profile-image-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img
                src={UserProfilePicture}
                alt="User"
                className="modal-profile-image"
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
              />
              <input
                type="file"
                onChange={handleImageChange}
                style={{ marginTop: '10px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
              />
            </div>
            <form>
              <label className="modal-label">
                Name:
                <input
                  type="text"
                  name="name"
                  value={editedUserData.name}
                  onChange={handleInputChange}
                  style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px' }}
                />
              </label>
              <label className="modal-label">
                Surname:
                <input
                  type="text"
                  name="surname"
                  value={editedUserData.surname}
                  onChange={handleInputChange}
                  style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px' }}
                />
              </label>
              <label className="modal-label">
                Email:
                <input
                  type="email"
                  name="email"
                  value={editedUserData.email}
                  onChange={handleInputChange}
                  style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px' }}
                />
              </label>
              <label className="modal-label">
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={editedUserData.phone}
                  onChange={handleInputChange}
                  style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px' }}
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
                  style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px' }}
                />
              </label>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="save-button"
                  onClick={handleProfileUpdate}
                  style={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
  )

  return (
    <div className="user-card">
      <div className="user-image">
        <img
          src={UserProfilePicture}
          alt="User"
        />
      </div>
      <h3>Kullanıcı Bilgileri</h3>
      <ul>
        <li><strong>Ad:</strong> {userData.name}</li>
        <li><strong>Soyad:</strong> {userData.surname}</li>
        <li><strong>Email:</strong> {userData.email}</li>
        <li><strong>Telefon:</strong> {userData.phone}</li>
        <li><strong>Cinsiyet:</strong> {userData.gender}</li>
        <li><strong>Doğum Tarihi:</strong> {userData.birthdate}</li>
      </ul>

      <button
        className="profile-edit-button"
        onClick={() => setIsModalOpen(true)}
        style={{
          margin: '10px auto',
          padding: '10px 20px',
          backgroundColor: '#4caf50',
          border: 'none',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer',
          display: 'block'
        }}
      >
        Edit Profile
      </button>

      <button
        className="logout-button"
        onClick={handleLogout}
        style={{
          margin: '10px auto',
          padding: '10px 20px',
          backgroundColor: '#ff4d4d',
          border: 'none',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer',
          display: 'block'
        }}
      >
        Log Out
      </button>

      {isModalOpen && ReactDOM.createPortal(renderModal(), document.body)}

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    </div>
  );
};


const EventCard = ({ event }) => {
  return (
    <div className="card">
      <Link to={event.path || '#'}>
        <div className="icon">{event.icon}</div>
        <h2>{event.title}</h2>
      </Link>
    </div>
  );
};

export default MainMenu;
