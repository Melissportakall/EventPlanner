import React from 'react'
import AppBar from '../AppBar/AppBar'
import { FaUser, FaUnlockAlt, FaBirthdayCake, FaTransgender, FaPhone } from "react-icons/fa";
import { LuPartyPopper } from "react-icons/lu";
import { IoChatboxEllipsesOutline, IoCreateOutline } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { FaRegCalendarAlt } from "react-icons/fa";
import { AiOutlinePicture } from "react-icons/ai";
import { MdCenterFocusStrong } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaClipboardList } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';


const CreateEvent = () => {
    return (



/*
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
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

*/


        <>
          <AppBar />
          <div className="wrapper">
            <div className="form-box register">
                <h1>Registration</h1>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Event Name"
                    name="eventname"
                  /*  required
                    onChange={handleChange} */
                  />
                  <LuPartyPopper className="icon" />
                </div>
                <div className="input-box">
                  <input
                    type="date"
                    placeholder="Event Date"
                    name="eventdate"
                  /*  required
                    onChange={handleChange}  */
                  />
                  <FaRegCalendarAlt className="icon" />
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Statement"
                    name="statement"
                  /*  required
                    onChange={handleChange} */
                  />
                  <MdCenterFocusStrong className="icon" />
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Event Time"
                    name="eventtime"
                  /*  required
                    onChange={handleChange} */
                  />
                  <FaClock  className="icon" />
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Categori"
                    name="kategori"
                   /* required
                    onChange={handleChange} */
                  />
                  <FaClipboardList className="icon" />
                </div>
               
               
               {/* Harita Kapsayıcı */}
          <div className="input-box">
            <label>Location</label>
            { /*<MapContainer
              center={[51.505, -0.09]} // Başlangıç koordinatları
              zoom={13}
              style={{ width: "100%", height: "100px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[51.505, -0.09]}>
                <Popup>
                  Your Event Location
                </Popup>
              </Marker>
            </MapContainer> */}
            <FaLocationDot className="icon" />
          </div>
                
                <button type="submit">Send To Admin</button>
               
               
             
            </div>
          </div>
        </>
      );
    };

export default CreateEvent;