import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/LoginRegister/RegisterForm';
import MainMenu from './Components/MainMenu/MainMenu';

function App() {
  return (
    <Router>
      <Routes>
        {/* Root route redirects to '/login' */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login route */}
        <Route path="/login" element={<LoginForm />} />
        
        {/* Register route */}
        <Route path="/register" element={<RegisterForm />} />

        {/* Main menu route */}
        <Route path="/mainmenu" element={<MainMenu />} />
      </Routes>
    </Router>
  );
}

export default App;
