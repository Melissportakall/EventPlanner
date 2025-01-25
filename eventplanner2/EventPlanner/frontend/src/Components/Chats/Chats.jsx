import React, { useState, useEffect } from 'react';
import './Chatpage.css';
import '../MainMenu/MainMenu.jsx';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import UserCard from '../UserCard/Usercard.jsx';

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

const ChatApp = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    document.title = 'Chats';
    fetchEvents();
  }, []);

  useEffect(() => {
    const userId = getUserDataFromCookies();

    if (userId) {
      fetch(`/get_user_info?user_id=${userId}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setUserData(data.user);
          } else {
            console.log(data.message);
          }
        })
        .catch((error) => console.error('Error fetching user data:', error));
    } else {
      console.log('No user ID found in cookies');
    }
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 500);
      return () => clearInterval(interval);
    }
  }, [selectedEvent]);

  const fetchEvents = () => {
    fetch('/get_joined_events')
      .then((res) => res.json())
      .then((data) => setEvents(data.events))
      .catch((err) => console.error(err));
  };

  const fetchMessages = () => {
    fetch(`/get_messages_by_event?etkinlik_id=${selectedEvent}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API Yanıtı:', data);
        setMessages(data.messages || []);
      })
      .catch((error) => console.error('Error fetching messages:', error));
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedEvent) return;

    const messageData = {
      etkinlik_id: selectedEvent,
      mesaj_metni: newMessage,
    };

    fetch('/send_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setNewMessage('');
          fetchMessages();
        }
      })
      .catch((error) => console.error('Error sending message:', error));
  };

  const handleLogout = () => {
    document.cookie = `user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `remember_me=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    navigate('/login');
  };

  return (
    <div className="chat-container">
      {userData ? (
        <UserCard userData={userData} handleLogout={handleLogout} />
      ) : (
        <p>No user data found.</p>
      )}
      <Navbar />
      <div className="sidebar">
        <h2>Events</h2>
        <ul className="contact-list">
          {events.map((event) => (
            <li key={event.id} onClick={() => setSelectedEvent(event.id)}>
              {event.event_name}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-area">
        <h2>Chatting Area</h2>
        <div className="chat-messages">
          {selectedEvent &&
            messages.map((message) => (
              <div
                key={message.id}
                className={`message-bubble ${
                  message.gonderici_ad === 'Ben' ? 'sent' : 'received'
                }`}
              >
                <strong>{message.gonderici_ad}:</strong> {message.mesaj_metni} <br />
                <small>{message.tarih}</small>
              </div>
            ))}
        </div>
        {selectedEvent && (
          <div className="input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesajınızı yazın"
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <button onClick={sendMessage}>Gönder</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
