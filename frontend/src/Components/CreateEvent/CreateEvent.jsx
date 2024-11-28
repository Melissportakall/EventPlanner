import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { LuPartyPopper } from "react-icons/lu";
import { FaRegCalendarAlt, FaClock, FaClipboardList } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';
import Navbar from '../Navbar/Navbar'; 
import UserCard from '../UserCard/Usercard.jsx'

const containerStyle = {
  width: '100%',
  height: '400px',
};

const getUserDataFromCookies = () => {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === 'user_data') {
      return value;
    }
  }
  return null;
};

const CreateEvent = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Create Event';
  }, []);

  useEffect(() => {
    const userId = getUserDataFromCookies();

    if (userId) {
      fetch(`/get_user_info?user_id=${userId}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setUserData(data.user);
          } else {
            console.log(data.message);
          }
        })
        .catch(error => console.error('Error fetching user data:', error));
    } else {
      console.log("No user ID found in cookies");
    }

   
  }, []);

  const [markerPosition, setMarkerPosition] = useState({
    lat: 41.015137,
    lng: 28.979530
  });
  const [address, setAddress] = useState('');
  const [eventData, setEventData] = useState({
    event_name: '',
    date: '',
    time: '',
    duration: '',
    description: '',
    category: ''
  });

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    getAddress(lat, lng);
  };

  const getAddress = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(lat, lng);

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          setAddress('No address found');
        }
      } else {
        setAddress('Geocoder failed due to: ' + status);
      }
    });
  };

  const handleAddressChange = (e) => {
    const inputAddress = e.target.value;
    setAddress(inputAddress);
    setEventData({ ...eventData, location: inputAddress });
  };

  const handleAddressBlur = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const formattedAddress = results[0].formatted_address;
        const location = results[0].geometry.location;
        setAddress(formattedAddress);
        setMarkerPosition({
          lat: location.lat(),
          lng: location.lng()
        });
        setEventData({ ...eventData, location: formattedAddress });
      } else {
        console.error('Geocoding failed: ', status);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const eventPayload = {
      ...eventData,
      location: address,
    };
  
    try {
      const eventResponse = await fetch('/create_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      });
  
      const eventResult = await eventResponse.json();
  
      if (eventResult.success) {
        console.log("Event created successfully.");
  
        const UserId = getUserDataFromCookies(); // Kullanıcı ID'yi al
  
        if (UserId) {
          const scorePayload = {
            user_id: UserId,
            point: 15,
            date: new Date().toISOString().split('T')[0], // Bugünkü tarih
          };
  
          const scoreResponse = await fetch('/add_point', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(scorePayload),
          });
  
          const scoreResult = await scoreResponse.json();
  
          if (scoreResult.success) {
            console.log("Points added successfully.");
            alert("Event created successfully and 15 points added to your account!");
            navigate("/mainmenu");
          } else {
            console.log("Error adding points:", scoreResult.message);
            alert("Event created, but an error occurred while adding points: " + scoreResult.message);
          }
        } else {
          console.log("User ID not found. Points cannot be added.");
          alert("Event created successfully, but points could not be added.");
        }
      } else {
        console.log("Error creating event:", eventResult.message);
        alert("An error occurred: " + eventResult.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleLogout = () => {
    document.cookie = `user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `remember_me=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    navigate('/login');
  };

  return (
    <div className="container">
      {userData ? (
          <UserCard userData={userData} handleLogout={handleLogout} />
        ) : (
          <p>No user data found.</p>
        )}

      <Navbar />
      <div className="wrapper">
        <div className="form-box">
          <h1>Create Event</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Event Name"
              name="event_name"
              value={eventData.event_name}
              onChange={handleChange}
            />
            <LuPartyPopper className="icon" />
          </div>

          <div className="input-box">
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
            />
            <FaRegCalendarAlt className="icon" />
          </div>

          <div className="input-box">
            <input
              type="text"
              placeholder="Event Time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
            />
            <FaClock className="icon" />
          </div>

          <div className="input-box">
            <input
              type="text"
              placeholder="Event Duration (min)"
              name="duration"
              value={eventData.duration}
              onChange={handleChange}
            />
            <FaClock className="icon" />
          </div>

          <div className="input-box">
            <input
              type="text"
              placeholder="Category"
              name="category"
              value={eventData.category}
              onChange={handleChange}
            />
            <FaClipboardList className="icon" />
          </div>

          <div id="map-container">
            <label>Location</label>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={markerPosition}
              zoom={13}
              onClick={handleMapClick}
            >
              <Marker position={markerPosition} />
            </GoogleMap>
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Location"
              value={address}
              onChange={handleAddressChange}
              onBlur={handleAddressBlur}
            />
          </div>
          <button type="submit" onClick={handleSubmit}>Create Event</button>
        </div>
      </div>
    </div>

  );
};

export default CreateEvent;
