import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state ekledik

  useEffect(() => {
    const cookies = document.cookie;
    const hasRememberMe = cookies.includes("remember_me=true");
    const hasUserData = cookies.includes("user_data");

    console.log("Cookies:", cookies); // Debug log
    console.log("hasRememberMe:", hasRememberMe); // Debug log
    console.log("hasUserData:", hasUserData); // Debug log

    // Kullanıcı giriş yapmamışsa, yönlendirme yapıyoruz
    if (!hasUserData && !hasRememberMe) {
      console.log("Yönlendirme yapılıyor"); // Debug log
      navigate("/login");
    } else {
      console.log("Giriş yapılmış, yönlendirme yapılmadı");
      setLoading(false); // Yönlendirme yapılmadığında loading state'i false yapıyoruz
    }
  }, [navigate]);

  // Eğer hala yükleniyorsa (loading true), sayfa içeriği gösterilmez
  if (loading) {
    return <div>Loading...</div>; // Yükleniyor mesajı
  }

  return children; // Yükleme tamamlandığında, korunan bileşeni render et
};

export default AuthGuard;
