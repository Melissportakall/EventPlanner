import React, { useEffect, useState } from 'react';
import { FaUser, FaUnlockAlt, FaBirthdayCake, FaTransgender, FaPhone } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { AiOutlinePicture } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

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
            const response = await fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                navigate("/login");
                alert(data.message);
            } else {
                alert("Registration failed.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

    const navigate = useNavigate();

    return (
        <div className="wrapper">
            <div className="form-box register">
                <form onSubmit={handleSubmit}>
                    <h1>Registration</h1>
                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder="Username" 
                            name="username"
                            required 
                            onChange={handleChange} 
                        />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder="Name" 
                            name="name" 
                            required 
                            onChange={handleChange} 
                        />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder="Surname" 
                            name="surname" 
                            required 
                            onChange={handleChange} 
                        />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input 
                            type="date" 
                            placeholder="BirthDate" 
                            name="birthdate" 
                            required 
                            onChange={handleChange} 
                        />
                        <FaBirthdayCake className='icon' />
                    </div>
                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder="Gender" 
                            name="gender" 
                            required 
                            onChange={handleChange} 
                        />
                        <FaTransgender className='icon' />
                    </div>
                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder="Phone Number" 
                            name="phonenumber" 
                            required 
                            onChange={handleChange} 
                        />
                        <FaPhone className='icon' />
                    </div>
                    <div className="input-box">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            name="email" 
                            required 
                            onChange={handleChange} 
                        />
                        <IoMdMail className='icon' />
                    </div>
                    <div className="input-box">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            name="password" 
                            required 
                            onChange={handleChange} 
                        />
                        <FaUnlockAlt className='icon' />
                    </div>

                    {/* İlgi Alanları */}
                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder="Select Interests" 
                            value={formData.interests.join(", ")} 
                            readOnly 
                        />
                        <AiOutlinePicture 
                            className='icon' 
                            onClick={() => setIsModalOpen(true)} 
                            style={{ cursor: 'pointer' }}
                        />
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" required /> I agree to the terms & conditions</label>
                    </div>
                    <button type="submit">Register</button>
                    <div className="register-link">
                        <p>Already have an account? <span onClick={() => navigate("/login")} style={{ cursor: 'pointer' }}>Login</span></p>
                    </div>
                </form>
            </div>

            {/* İlgi Alanları Modali */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Select Your Interests</h2>
                        <div className="checkbox-list">
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
