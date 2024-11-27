import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const LogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kullanıcı oturumunu sonlandır
    // Örneğin, bir token'i temizle
    localStorage.removeItem('token');

    // 2 saniye bekleyip login ekranına yönlendir
    const timeout = setTimeout(() => {
      navigate('/register');
    }, 2000);

    return () => clearTimeout(timeout); // Temizlik işlemi
  }, [navigate]);

  return (
    <div>
      <h1>Çıkış Yapılıyor...</h1>
    </div>
  );
};

export default LogOut;
