import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import './MyEvents.css';
const MyEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/get_all_events')
      .then(response => {
        if (!response.ok) {
          throw new Error("Veri çekilirken hata oluştu");
        }
        return response.json();
      })
      .then(data => setEvents(data.events)) // Burada `data.events` kullanıyoruz
      .catch(error => console.error("Hata:", error));
  }, []);

  return (
    <Grid container spacing={3} style={{ padding: '20px' }}>
      {events.length > 0 ? (
        events.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Paper elevation={3} style={{ padding: '15px', textAlign: 'center' }}>
              <Typography variant="h6">{event.event_name}</Typography>
              <Typography color="textSecondary">{event.date} - {event.time}</Typography>
              <Typography variant="body2">{event.description}</Typography>
              <Typography variant="body2">Süre: {event.duration}</Typography>
              <Typography variant="body2">Yer: {event.location}</Typography>
              <Typography variant="body2">Kategori: {event.category}</Typography>
            </Paper>
          </Grid>
        ))
      ) : (
        <Typography variant="body1">Henüz katıldığınız bir etkinlik bulunmamaktadır.</Typography>
      )}
    </Grid>
  );
};

export default MyEvents;
