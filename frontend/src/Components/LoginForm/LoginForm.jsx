import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaUnlockAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      if (data.success) {
        // Giriş başarılı, /mainmenu adresine yönlendir
        navigate("/mainmenu");
      } else {
        // Giriş başarısız, hata mesajını göster
        alert(data.message);
      }
    } catch (error) {
      console.error("Giriş işlemi başarısız:", error);
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-box">
          <input 
            type="text" 
            placeholder="Username" 
            required 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUser className='icon'/>
        </div>
        <div className="input-box">
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaUnlockAlt className='icon'/>
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" />Remember me
          </label>
          <a href="#" id='loginForgotPassword'>Forgot password?</a>
        </div>
        <button type="submit">Login</button>
        <div className="register-link">
          <p>Don't have an account? <span onClick={() => navigate("/register")} style={{ cursor: 'pointer' }}>Register Here</span></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
