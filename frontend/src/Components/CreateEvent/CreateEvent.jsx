import React from 'react';
import AppBar from '../AppBar/AppBar';
import { FaUser, FaUnlockAlt, FaBirthdayCake, FaTransgender, FaPhone, FaClock, FaClipboardList } from "react-icons/fa";
import { LuPartyPopper } from "react-icons/lu";
import { IoChatboxEllipsesOutline, IoCreateOutline } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { FaRegCalendarAlt } from "react-icons/fa";
import { AiOutlinePicture } from "react-icons/ai";
import { MdCenterFocusStrong } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: 41.015137,
  lng: 28.979530
};

const CreateEvent = () => {
  return (
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
            />
            <LuPartyPopper className="icon" />
          </div>
          <div className="input-box">
            <input
              type="date"
              placeholder="Event Date"
              name="eventdate"
            />
            <FaRegCalendarAlt className="icon" />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Statement"
              name="statement"
            />
            <MdCenterFocusStrong className="icon" />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Event Time"
              name="eventtime"
            />
            <FaClock className="icon" />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Category"
              name="kategori"
            />
            <FaClipboardList className="icon" />
          </div>

          {/* Google Maps Kapsayıcı */}
          <div className="input-box">
            <label>Location</label>
            <LoadScript googleMapsApiKey="AIzaSyDtydezxJOCiLH1LI08WpbZ5qltWhjYxoI">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
            <FaLocationDot className="icon" />
          </div>

          <button type="submit">Send To Admin</button>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
