import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    const userDataFromCookie = getUserDataFromCookies();
    if (userDataFromCookie) {
      setUserData(userDataFromCookie);
    } else {
      console.log("No user data found in cookies");
    }
  }, []);

  return (
    <div>
      <h1>Welcome to the Main Menu!</h1>
      {userData ? (
        <p>Welcome, User ID: {userData}</p>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
};

export default MainMenu;
