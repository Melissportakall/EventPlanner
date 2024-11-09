// ShowEvents.js
import React, { useEffect, useState } from 'react';
import './ShowEvents.css'; // Stil dosyası

const ShowEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/get_all_events') // URL'yi güncelledik
      .then(response => response.json())
      .then(data => {
        if (data.events) {
          setEvents(data.events);
        } else {
          console.log(data.message);
        }
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  return (
    <div className="event-list-container">
      <h2>Etkinlikler</h2>
      <table className="event-table">
        <thead>
          <tr>
            <th>Etkinlik Adı</th>
            <th>Açıklama</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Yer</th>
            <th>Kategori</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event, index) => (
              <tr key={index}>
                <td>{event.event_name}</td>
                <td>{event.description}</td>
                <td>{event.date}</td>
                <td>{event.time}</td>
                <td>{event.location}</td>
                <td>{event.category}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Hiç etkinlik bulunamadı.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShowEvents;
