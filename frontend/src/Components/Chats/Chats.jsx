import React, { useState, useEffect } from 'react';
import './Chatpage.css';
import '../MainMenu/MainMenu.jsx';

import Navbar from '../Navbar/Navbar'; 
import UserCard from '../UserCard/Usercard.jsx';

const ChatApp = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    document.title = 'Chats';
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 500);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  const fetchUsers = () => {
    fetch('/get_users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  };

  const fetchMessages = () => {
    fetch(`/get_messages?alici_id=${selectedUser}`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Gelen Mesajlar:', data);
        setMessages(data);
      })
      .catch(error => console.error('Error fetching messages:', error));
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      alici_id: selectedUser,
      mesaj_metni: newMessage
    };

    fetch('/send_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Mesaj gönderildi') {
          setNewMessage('');
          fetchMessages();
        }
      })
      .catch(error => console.error('Error sending message:', error));
  };

 

  return (
    
    <div className="chat-container">
      
      <Navbar/>
      <UserCard/>
      <div className="sidebar">
        <h2>Persons-Groups</h2>
        <ul className="contact-list">
          {users.map(user => (
            <li key={user.id} onClick={() => setSelectedUser(user.id)}>
              {user.ad}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-area">
        <h2>Chating Area</h2>
        <div className="chat-messages">
          {selectedUser && messages.map((message) => (
            <div
              key={message.id}
              className={`message-bubble ${message.gonderici_ad === 'Ben' ? 'sent' : 'received'}`}
            >
              <strong>{message.gonderici_ad}:</strong> {message.mesaj_metni} <br />
              <small>{message.tarih}</small>
            </div>
          ))}
        </div>
        {selectedUser && (
          <div className="input-container">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Mesajınızı yazın"
              onKeyDown={e => {
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
