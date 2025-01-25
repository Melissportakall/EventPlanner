import React, { useEffect, useState } from 'react';
import './Chats.css';

const UserList = ({ onEventSelect }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/get_joined_events', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.events) {
          setEvents(data.events);
        } else {
          console.error('Error fetching events:', data.message);
        }
      })
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div className="user-list">
      <h3>Joined Events</h3>
      <ul>
        {events.map(event => (
          <li key={event.id} onClick={() => onEventSelect(event.id)}>
            {event.event_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
