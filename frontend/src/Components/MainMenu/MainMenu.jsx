import React, { useEffect, useState } from 'react';
import { LuPartyPopper } from "react-icons/lu";
import { IoChatboxEllipsesOutline, IoCreateOutline } from "react-icons/io5";
import './Card.css';
import AppBar from '../AppBar/AppBar.jsx'; 

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
    const userDataFromCookie = getUserDataFromCookies();
    if (userDataFromCookie) {
      setUserData(userDataFromCookie);
    } else {
      console.log("No user data found in cookies");
    }

    // Örnek etkinlik verisi
    const exampleEvents = [
      { title: 'My Events', icon: <LuPartyPopper /> },
      { title: 'Chats', icon: <IoChatboxEllipsesOutline /> },
      { title: 'Create Event', icon: <IoCreateOutline /> },
    ];
    setEvents(exampleEvents); // Örnek etkinlikleri duruma ekle
  }, []);

  return (
    <div>
      <AppBar /> {/* AppBar bileşenini burada render et */}
      <h1>Welcome to the Main Menu!</h1>
      {userData ? (
        <p>Welcome, User ID: {userData}</p>
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
      <div className='icon'>{event.icon}</div> {/* İkonu göster */}
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>{event.date}</p>
    </div>
  );
}

export default MainMenu;
