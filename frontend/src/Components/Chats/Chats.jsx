import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import MessageApp from './Chatpage';
import './Chats.css';

const Chats = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/get_users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  return (
    <div className="chats">
      <div className="sidebar">
        <UserList users={users} onUserSelect={handleUserSelect} />
      </div>
      <div className="chat">
        {selectedUser ? (
          <MessageApp recipientId={selectedUser} />
        ) : (
          <h2>Bir kullanıcı seçin</h2>
        )}
      </div>
    </div>
  );
};

export default Chats;
