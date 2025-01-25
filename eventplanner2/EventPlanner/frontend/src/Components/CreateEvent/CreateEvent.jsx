import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { LuPartyPopper } from "react-icons/lu";
import { FaRegCalendarAlt, FaClock, FaClipboardList } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';
import Navbar from '../Navbar/Navbar';
import UserCard from '../UserCard/Usercard.jsx'
import { AiOutlinePicture } from "react-icons/ai";
import { positions } from '@mui/system';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableCategories] = useState(["Music", "Sports", "Technology", "Art", "Travel", "Books"]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    document.title = 'Create Event';
  }, []);

  useEffect(() => {
    const userId = getUserDataFromCookies();
    console.log("Modal open state:", isModalOpen);

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

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCategories((prevState) =>
      checked
        ? [...prevState, value] //Ekleniyor
        : prevState.filter((category) => category !== value) //Çıkarılıyor
    );
  };

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
      category: JSON.stringify(selectedCategories)
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

        const UserId = getUserDataFromCookies();

        if (UserId) {
          const scorePayload = {
            user_id: UserId,
            point: 15,
            date: new Date().toISOString().split('T')[0], //Bugünkü tarih
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
      <h1>Create Event
          <style>
            {`h1 { text-align: center }`}
            {`h1 { color: #ffff }`}
            {'h1 { margin-bottom:0px }'}
          </style>
        </h1>
      <div className="wrapper">
        <div className="form-box">
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
            placeholder="Select Categories"
            value={selectedCategories.join(", ")}
            readOnly
          />
          <AiOutlinePicture
            className="icon"
            onClick={() => setIsModalOpen(true)}
            style={{ cursor: 'pointer' }}
          />
        </div>

        {/* Modal Görünümü */}
        {isModalOpen && (
          <div className="modal" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Select Categories</h2>
              {availableCategories.map((category) => (
                <div key={category}>
                  <label>
                    <input
                      type="checkbox"
                      value={category}
                      checked={selectedCategories.includes(category)}
                      onChange={handleCheckboxChange}
                    />
                    {category}
                  </label>
                </div>
              ))}
              <button onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        )}
        <div className="input-box">
          <input
            type="text"
            placeholder="Description"
            name="description"
            value={eventData.description}
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
        <button onClick={handleSubmit}>Create Event</button>  
        </div>
      </div>

      </div>
  )};

export default CreateEvent;
