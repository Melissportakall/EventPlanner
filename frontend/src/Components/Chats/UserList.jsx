import React from 'react';
import './Chats.css';

const UserList = ({ users, onUserSelect }) => {
  return (
    <div className="user-list">
      <h3>Kullanıcılar</h3>
      <ul>
        {users.map(user => (
          <li key={user.id} onClick={() => onUserSelect(user.id)}>
            {user.ad}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
