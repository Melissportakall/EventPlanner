import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import LoginForm from './Components/LoginForm/LoginForm';
import AuthGuard from './Components/AuthGuard/AuthGuard';
import RegisterForm from './Components/LoginRegister/RegisterForm';
import MainMenu from './Components/MainMenu/MainMenu';
import CreateEvent from './Components/CreateEvent/CreateEvent';
import AllEvents from './Components/AllEvents/AllEvents';
import MyEvents from './Components/MyEvents/MyEvents';
import Chats from './Components/Chats/Chats';
import ViewMyProfile from './Components/ViewMyProfile/ViewMyProfile';
import LogOut from './Components/LogOut/LogOut';
import  AdminMainMenu  from './Components/AdminMainMenu/AdminMainMenu';
import AdminNotifications from './Components/AdminNotifications/AdminNotifications';

function App() {
  useEffect(() => {
    const handleTabClose = () => {
      const rememberMe = document.cookie
        .split('; ')
        .find((row) => row.startsWith('remember_me='))
        ?.split('=')[1];

      if (rememberMe !== 'true') {
        document.cookie = 'user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDtydezxJOCiLH1LI08WpbZ5qltWhjYxoI">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/adminmainmenu" element={<AdminMainMenu />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* AuthGuard ile korunan alanlar */}
          <Route
            path="/*"
            element={
              <AuthGuard>
                <Routes>
                  <Route path="/mainmenu" element={<MainMenu />} />
                  <Route path="/create-event" element={<CreateEvent />} />
                  <Route path="/all-events" element={<AllEvents />} />
                  <Route path="/my-events" element={<MyEvents />} />
                  <Route path="/chats" element={<Chats />} />
                  <Route path="/view-profile" element={<ViewMyProfile />} />
                  <Route path="/logout" element={<LogOut />} />
                  <Route path="/notifications" element={<AdminNotifications />} />
                </Routes>
              </AuthGuard>
            }
          />
        </Routes>
      </Router>
    </LoadScript>
  );
}export default App;