// RegisterForm.jsx
import React from 'react';
import { FaUser, FaUnlockAlt, FaBirthdayCake, FaTransgender, FaPhone } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { AiOutlinePicture } from "react-icons/ai";

const RegisterForm = ({ toggleForm }) => {
    return (
        <div className="wrapper">
            <div className="form-box register">
                <form action="">
                    <h1>Registration</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="name" placeholder="Name" required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="surname" placeholder="Surname" required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                    <input type="date" placeholder="BirthDate" required />
                        
          
                        <FaBirthdayCake className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="gender" placeholder="Gender" required />
                        <FaTransgender className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="phonenumber" placeholder="Phone Number" required />
                        <FaPhone className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder="Email" required />
                        <IoMdMail className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" required />
                        <FaUnlockAlt className='icon' />
                    </div>
                    <div className="remember-forgot">
                        <label><input type="checkbox" />I agree to the terms & conditions</label>
                    </div>
                    <button type="submit">Register</button>
                    <div className="register-link">
                        <p>Already have an account? <a href="#" onClick={toggleForm}>Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
