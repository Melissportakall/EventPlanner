// RegisterForm.jsx
import React, { useState } from 'react';
import { FaUser, FaUnlockAlt, FaBirthdayCake, FaTransgender, FaPhone } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        surname: "",
        birthdate: "",
        gender: "",
        phonenumber: "",
        email: "",
        password: ""
    });

    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isChecked) {
            alert("Please agree to the terms & conditions to register.");
            return;
        }

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
                alert("Kayıt başarısız.");
            }
        } catch (error) {
            console.error("Hata:", error);
        }
    };

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
                    <div className="remember-forgot">
                        <label>
                            <input 
                                type="checkbox" 
                                required 
                                onChange={handleCheckboxChange}
                            />
                            I agree to the terms & conditions
                        </label>
                    </div>
                    <button 
                        type="submit" 
                        disabled={!isChecked} // Disable button if checkbox is not checked
                    >
                        Register
                    </button>
                    <div className="register-link">
                        <p>Already have an account? <span onClick={() => navigate("/login")} style={{ cursor: 'pointer' }}>Login</span></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
