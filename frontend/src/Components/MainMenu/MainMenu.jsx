import React, { useEffect, useState } from 'react';
import { LuPartyPopper } from "react-icons/lu";
import { IoChatboxEllipsesOutline, IoCreateOutline } from "react-icons/io5";
import './Card.css';
import AppBar from '../AppBar/AppBar.jsx'; 
import { Link } from 'react-router-dom';
import CreateEvent from '../CreateEvent/CreateEvent.jsx';

const getUserDataFromCookies = () => {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === 'user_data') {
          return value;  // Bu, kullanıcı verisi (örneğin, kullanıcı ID'si) olmalı
      }
  }
  return null;  // "user_data" cookie'si yoksa null döner
};

const MainMenu = () => {
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]); // Etkinlikler için durum

  useEffect(() => {
    // Kullanıcı ID'sini cookie'den al
    const userId = getUserDataFromCookies();
    
    // Eğer kullanıcı ID'si varsa kullanıcı verilerini çekmek için API'yi çağır
    if (userId) {
      fetch(`/get_user_data?user_id=${userId}`, {
        method: 'GET',
        credentials: 'include' // Cookie'yi backend'e göndermek için
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUserData({ name: data.name, surname: data.surname });
        } else {
          console.log(data.message);
        }
      })
      .catch(error => console.error('Error fetching user data:', error));
    } else {
      console.log("No user ID found in cookies");
    }

    // Örnek etkinlik verisi
    const exampleEvents = [
      { title: 'My Events', icon: <LuPartyPopper /> },
      { title: 'Chats', icon: <IoChatboxEllipsesOutline /> },
      { title: 'Create Event', icon: <IoCreateOutline />, path: '/CreateEvent' },
    ];
    setEvents(exampleEvents); // Örnek etkinlikleri duruma ekle

  }, []);
  
  return (
    <div style={{ color: 'white' }}>
      <AppBar /> {/* AppBar bileşenini burada render et */}
      <h1>Welcome to the Main Menu!</h1>
      {userData ? (
        <p>Welcome, {userData.name} {userData.surname}</p>
      ) : (
        <p>No user data found.</p>
      )}
      <div>
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </div>
  );
};

const EventCard = ({ event }) => {
  return (
    <div className='card'>
      <Link to={event.path || '#'}> {/* Tıklanabilir hale getir */}
        <div className='icon'>{event.icon}</div> {/* İkonu göster */}
        <h2>{event.title}</h2>
      </Link>
    </div>
  );
}

export default MainMenu;