import React, { useEffect, useState } from 'react';
import { LuPartyPopper } from "react-icons/lu";
import { IoChatboxEllipsesOutline, IoCreateOutline } from "react-icons/io5";
import './Card.css';
import AppBar from '../AppBar/AppBar.jsx';
import { Link } from 'react-router-dom';
import ShowEvents from '../ShowEvents/ShowEvents';
import AllEvents from '../AllEvents/AllEvents.jsx'
import RandomCategoryChart from '../PieCharts/PieCharts';
import Chats from '../Chats/Chats.jsx';

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
      fetch(`/get_user_info?user_id=${userId}`, {
        method: 'GET',
        credentials: 'include' // Cookie'yi backend'e göndermek için
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setUserData(data.user); // Tüm kullanıcı bilgilerini ayarla
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
      { title: 'My Events', icon: <LuPartyPopper /> ,path: '/MyEvents'},
      { title: 'Chats', icon: <IoChatboxEllipsesOutline /> , path: '/Chats'},
      { title: 'Create Event', icon: <IoCreateOutline />, path: '/CreateEvent' },
      { title: 'All Events', icon: <IoCreateOutline />, path: '/AllEvents' },
    ];
    setEvents(exampleEvents); // Örnek etkinlikleri duruma ekle

  }, []);

  return (
    <div style={{ color: 'white' }}>

      <h1>Welcome to the Main Menu!</h1>
      {userData ? (
        <UserCard userData={userData} />
      ) : (
        <p>No user data found.</p>
      )}
      
      <RandomCategoryChart />
      <div className="card-container">  {/* Yeni eklenen kapsayıcı */}
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </div>
  );
};

const UserCard = ({ userData }) => {
  return (
    <div className="user-card">
      <div className="user-image">
        {/* Burada kullanıcı resmi için bir alan oluşturuyoruz */}
        <img src={userData.profileImage || 'default-image-url.jpg'} alt="User" />
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
