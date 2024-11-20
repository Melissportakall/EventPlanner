import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Modal, Button, Box, Snackbar } from '@mui/material';
import { GoogleMap } from '@react-google-maps/api';
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
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 41.015137, lng: 28.979530 });
  const [marker, setMarker] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    document.title = 'My Events';
  }, []);

  useEffect(() => {
    const loadMapScript = () => {
      if (window.google) {
        setIsLoaded(true);
      } else {
        console.error("Google Maps API yüklenemedi.");
      }
    };
    
    if (window.google) {
      loadMapScript();
    } else {
      window.addEventListener("load", loadMapScript);
      return () => {
        window.removeEventListener("load", loadMapScript);
      };
    }
  }, []);

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

  const fetchCoordinates = (address) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const latLng = { lat: location.lat(), lng: location.lng() };
        setMarkerPosition(latLng);
        if (map) {
          map.panTo(latLng);
        }
      } else {
        console.error('Geocode was not successful for the following reason:', status);
        setSnackbarMessage('Location not found. Showing default location.');
        setSnackbarOpen(true);
      }
    });
  };

  const handleLeaveEvent = (eventId) => {
    fetch('/leave_event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(data.message);
          window.location.reload();
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('Error leaving event:', error);
        alert('An error occurred while trying to leave the event.');
      });
  };
  

  const handleOpen = (event) => {
    setSelectedEvent(event);
    setOpen(true);

    if (event.location) {
      fetchCoordinates(event.location);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (isLoaded && map && selectedEvent) {
      if (window.google.maps.marker?.AdvancedMarkerElement) {
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: markerPosition,
        });

        return () => {
          marker.setMap(null);
        };
      } else {
        const marker = new window.google.maps.Marker({
          map,
          position: markerPosition,
        });

        return () => {
          marker.setMap(null);
        };
      }
    }
  }, [isLoaded, map, selectedEvent, markerPosition]);

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
                center={markerPosition}
                zoom={13}
                onLoad={(mapInstance) => setMap(mapInstance)}
              ></GoogleMap>

              <Button variant="contained" color="primary" onClick={() => handleLeaveEvent(selectedEvent?.id)}>
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
