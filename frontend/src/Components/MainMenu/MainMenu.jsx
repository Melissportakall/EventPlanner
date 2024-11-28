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
import UserCard from '../UserCard/Usercard.jsx'

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
      <div className="container">
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
