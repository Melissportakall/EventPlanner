import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/LoginRegister/RegisterForm';
import MainMenu from './Components/MainMenu/MainMenu';
import CreateEvent from './Components/CreateEvent/CreateEvent';
import AllEvents from './Components/AllEvents/AllEvents';
import MyEvents from './Components/MyEvents/MyEvents';
import Chats from './Components/Chats/Chats';

function App() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyDtydezxJOCiLH1LI08WpbZ5qltWhjYxoI">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/mainmenu" element={<MainMenu />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/all-events" element={<AllEvents />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/chats" element={<Chats />} />
        </Routes>
      </Router>
    </LoadScript>
  );
}

export default App;
