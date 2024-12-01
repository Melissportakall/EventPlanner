import React, { useEffect, useState } from 'react';
import { FaUser, FaUnlockAlt, FaBirthdayCake, FaTransgender, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { AiOutlinePicture } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import styles from './RegisterForm.module.css';


const RegisterForm = ({ toggleForm }) => {
    useEffect(() => {
        document.title = 'Register';
    }, []);

    const [formData, setFormData] = useState({
        username: "",
        name: "",
        surname: "",
        birthdate: "",
        gender: "",
        phonenumber: "",
        email: "",
        password: "",
        interests: []
    });

    const [isModalOpen, setIsModalOpen] = useState(false); // İlgi alanları modalını kontrol eder
    const [availableInterests] = useState(["Music", "Sports", "Technology", "Art", "Travel", "Books"]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            interests: checked
                ? [...prevState.interests, value] // Ekleniyor
                : prevState.interests.filter((interest) => interest !== value) // Çıkarılıyor
        }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          // İlk olarak mevcut kullanıcıları kontrol etmek için get_all_users isteği gönder
          const usersResponse = await fetch('/get_all_users');
          const usersData = await usersResponse.json();
  
          if (!usersData.success) {
              alert("Kullanıcıları alırken bir hata oluştu.");
              return;
          }
  
          // Mevcut kullanıcıları kontrol et
          const existingUser = usersData.users.find(user => 
              user.kullanici_adi === formData.username || 
              user.eposta === formData.email || 
              user.telefon_no === formData.phonenumber
          );
  
          if (existingUser) {
              // Eğer aynı kullanıcı adı, e-posta veya telefon numarası varsa, hata mesajı göster
              alert("Bu kullanıcı adı, e-posta ya da telefon numarası zaten kullanılıyor.");
              return;
          }
  
          // Eğer kontrol başarılıysa, yeni kullanıcı kaydını yap
          const response = await fetch("/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData)
          });
          const data = await response.json();
  
          console.log(data);
          
          if (data.success) {
              const userId = data.userId;
  
              console.log(userId);
  
              const pointResponse = await fetch('/add_point', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ user_id: userId, point: 20 })
              });
  
              const pointData = await pointResponse.json();
              if (pointData.success) {
                  alert("Kayıt başarılı, 20 puan eklendi!");
              } else {
                  alert("Puan ekleme işlemi başarısız oldu.");
              }
  
              navigate("/login");
          } else {
              alert("Registration failed.");
          }
      } catch (error) {
          console.error("Error during registration:", error);
      }
  };
  
    const navigate = useNavigate();

    return (
        <div className={styles.wrapper}>
          <div className={styles.form_box}>
            <form onSubmit={handleSubmit}>
              <h1 style={{ textAlign: 'center' }}>
                Registration
              </h1>
              <div className={styles.input_group}>
                {/* Sol Sütun */}
                <div className={styles.input_box}>
                  <input 
                    type="text" 
                    placeholder="Username" 
                    name="username"
                    required 
                    onChange={handleChange} 
                  />
                  <FaUser className={styles.icon} />
                </div>
                <div className={styles.input_box}>
                  <input 
                    type="text" 
                    placeholder="Name" 
                    name="name" 
                    required 
                    onChange={handleChange} 
                  />
                  <FaUser className={styles.icon} />
                </div>
                <div className={styles.input_box}>
                  <input 
                    type="text" 
                    placeholder="Surname" 
                    name="surname" 
                    required 
                    onChange={handleChange} 
                  />
                  <FaUser className={styles.icon} />
                </div>
                <div className={styles.input_box}>
                  <input 
                    type="date" 
                    placeholder="BirthDate" 
                    name="birthdate" 
                    required 
                    onChange={handleChange} 
                    style={{
                      backgroundColor:'transparent',
                      color:'#fff'
                    }}
                    
                  />
                  <FaBirthdayCake className={styles.icon} />
                </div>
      
                {/* Sağ Sütun */}
                <div className={styles.input_box}>
                  <input 
                    type="text" 
                    placeholder="Gender" 
                    name="gender" 
                    required 
                    onChange={handleChange} 
                  />
                  <FaTransgender className={styles.icon} />
                </div>
                <div className={styles.input_box}>
                  <input 
                    type="text" 
                    placeholder="Phone Number" 
                    name="phonenumber" 
                    required 
                    onChange={handleChange} 
                  />
                  <FaPhone className={styles.icon} />
                </div>
                <div className={styles.input_box}>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    name="email" 
                    required 
                    onChange={handleChange} 
                  />
                  <IoMdMail className={styles.icon} />
                </div>
                <div className={styles.input_box}>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    name="password" 
                    required 
                    onChange={handleChange} 
                  />
                  <FaUnlockAlt className={styles.icon} />
                </div>
      
                {/* Adres ve İlgi Alanları */}
                <div className={styles.input_box}>
                  <input 
                    type="text" 
                    placeholder="Address" 
                    name="address" 
                    required 
                    onChange={handleChange} 
                    className={styles.large_input}
                  />
                  <FaMapMarkerAlt className={styles.icon} />
                </div>
      
                <div className={styles.input_box}>
                  <input 
                    type="text" 
                    placeholder="Select Interests" 
                    value={formData.interests.join(", ")} 
                    readOnly 
                  />
                  <AiOutlinePicture 
                    className={styles.icon} 
                    onClick={() => {
                        console.log("Icon clicked!");
                        setIsModalOpen(true);
                    }} 
                    style={{ cursor: 'pointer' }} 
                    />
                </div>
              </div>
      
              <div className={styles.remember_forgot}>
                <label><input type="checkbox" required /> I agree to the terms & conditions</label>
              </div>
              <button type="submit">Register</button>
              <div className={styles.register_link}>
                <p>Already have an account? <span onClick={() => navigate("/login")} style={{ cursor: 'pointer' }}>Login</span></p>
              </div>
            </form>
          </div>
      
          {/* İlgi Alanları Modali */}
          {isModalOpen && (
            <div className={styles.modal_overlay}>
              <div className={styles.modal_content}>
                <h2>Select Your Interests</h2>
                <div className={styles.checkbox_list}>
                  {availableInterests.map((interest, index) => (
                    <label key={index}>
                      <input 
                        type="checkbox" 
                        value={interest} 
                        onChange={handleCheckboxChange}
                        checked={formData.interests.includes(interest)}
                      />
                      {interest}
                    </label>
                  ))}
                </div>
                <button onClick={() => setIsModalOpen(false)}>Done</button>
              </div>
            </div>
          )}
        </div>
    );
};

export default RegisterForm;
