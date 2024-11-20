import React, { useEffect, useState } from 'react';
import { LuPartyPopper } from "react-icons/lu";
import { IoChatboxEllipsesOutline, IoCreateOutline } from "react-icons/io5";
import './Card.css';
import { Link, useNavigate } from 'react-router-dom';
import RandomCategoryChart from '../PieCharts/PieCharts';

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
    // Tüm cookie'leri sil
    document.cookie = `user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `remember_me=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    // Login sayfasına yönlendir
    navigate('/login');
  };

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

    const exampleEvents = [
      { title: 'My Events', icon: <LuPartyPopper />, path: '/my-events' },
      { title: 'Chats', icon: <IoChatboxEllipsesOutline />, path: '/chats' },
      { title: 'Create Event', icon: <IoCreateOutline />, path: '/create-event' },
      { title: 'All Events', icon: <IoCreateOutline />, path: '/all-events' },
    ];
    setEvents(exampleEvents);
  }, []);

  return (
    <div style={{ color: 'white' }}>
      <h1>Welcome to the Main Menu!</h1>
      {userData ? (
        <UserCard userData={userData} handleLogout={handleLogout} />
      ) : (
        <p>No user data found.</p>
      )}
      <RandomCategoryChart />
      <div className="card-container">
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </div>
  );
};

const UserCard = ({ userData, handleLogout }) => {
  return (
    <div className="user-card">
      <div className="user-image">
        <img
          src={userData.profileImage || 'default-image-url.jpg'}
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
        <li><strong>Yaş:</strong> {userData.age}</li>
      </ul>
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
