import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Modal, Button, Box, Snackbar } from '@mui/material';
import { GoogleMap, Marker } from '@react-google-maps/api';
import './MyEvents.css';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetch('/get_joined_events')
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

  const handleOpen = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const isValidCoordinates = (lat, lng) => !isNaN(lat) && !isNaN(lng);

  const fallbackLat = 41.015137;
  const fallbackLng = 28.979530;

  return (
    <div className="event-list-container">
      <Typography variant="h4" align="center" style={{ color: 'white' }} gutterBottom>
        My Events
      </Typography>

      <Grid container spacing={3}>
        {events.length > 0 ? (
          events.map((event) => (
            <Grid item xs={12} sm={4} md={4} key={event.id}>
              <Paper
                elevation={3}
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  minHeight: '250px',
                }}
                onClick={() => handleOpen(event)}
              >
                <Typography variant="h6">{event.event_name}</Typography>
                <Typography color="textSecondary">{event.date}</Typography>
                <Typography color="textSecondary">{event.time}</Typography>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No events found.</Typography>
        )}
      </Grid>

      {/* Modal */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box className="modal-box">
          {selectedEvent && (
            <>
              <Typography variant="h6" align="center" marginBottom={2} marginTop={2}>
                <strong>{selectedEvent.event_name}</strong>
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong> {selectedEvent.description}
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong> {selectedEvent.date}
              </Typography>
              <Typography variant="body1">
                <strong>Time:</strong> {selectedEvent.time}
              </Typography>
              <Typography variant="body1">
                <strong>Location:</strong> {selectedEvent.location}
              </Typography>

              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                  lat: isValidCoordinates(selectedEvent.location_latitude, selectedEvent.location_longitude)
                    ? selectedEvent.location_latitude
                    : fallbackLat,
                  lng: isValidCoordinates(selectedEvent.location_latitude, selectedEvent.location_longitude)
                    ? selectedEvent.location_longitude
                    : fallbackLng,
                }}
                zoom={13}
              >
                {isValidCoordinates(selectedEvent.location_latitude, selectedEvent.location_longitude) && (
                  <Marker
                    position={{
                      lat: selectedEvent.location_latitude,
                      lng: selectedEvent.location_longitude,
                    }}
                  />
                )}
              </GoogleMap>

              <Button variant="contained" color="primary" onClick={() => alert('Leave Event functionality')}>
                Leave Event
              </Button>
            </>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default MyEvents;
