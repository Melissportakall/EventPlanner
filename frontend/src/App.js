import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import MainMenu from './Components/MainMenu/MainMenu';

function App() {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    fetch("/login").then(
      res => res.json()
    ).then(
      data => {
        setData(data);
        console.log(data);
      }
    )
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/mainmenu" element={<MainMenu />} />
      </Routes>
    </Router>
  );
}

export default App;
