import React, { useEffect, useState } from 'react';
import './AdminAllEvents.css';
import { Grid, Paper, Typography, Modal, Button, Box, Snackbar } from '@mui/material';
import { GoogleMap } from '@react-google-maps/api';
import Navbar from '../AdminNavbar/AdminNavbar';
import { useNavigate } from 'react-router-dom';

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

const AdminAllEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 41.015137, lng: 28.979530 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'All Events';

    // Fetch all events
    fetch('/get_all_events')
      .then((response) => response.json())
      .then((data) => {
        if (data.events) {
          setEvents(data.events);
          filterEvents(data.events, 0); // Default to upcoming events
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const filterEvents = (events, tabIndex) => {
    const now = new Date();
    if (tabIndex === 0) {
      // Filter upcoming events
      const upcoming = events.filter((event) => new Date(event.date) >= now);
      setFilteredEvents(upcoming);
    } else if (tabIndex === 1) {
      // Filter past events
      const past = events.filter((event) => new Date(event.date) < now);
      setFilteredEvents(past);
    }
  };

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

  const handleOpen = (event) => {
    setSelectedEvent(event);
    setOpen(true); // Modal'ı aç

    if (event.location) {
      fetchCoordinates(event.location);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      // Etkinliği silme isteği
      const response = await fetch('/delete_event', {
        method: 'POST',
        body: JSON.stringify({ eventId: selectedEvent.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log('Etkinlik başarıyla silindi!');
        setSnackbarMessage('Etkinlik başarıyla silindi!');
        setSnackbarOpen(true);

        // Silinen etkinliği listeden çıkar
        setFilteredEvents(filteredEvents.filter(event => event.id !== selectedEvent.id));
      } else {
        console.error('Etkinlik silinemedi!');
        setSnackbarMessage('Etkinlik silinemedi!');
        setSnackbarOpen(true);
      }

      handleClose();
    } catch (error) {
      console.error('Hata:', error);
      setSnackbarMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
      setSnackbarOpen(true);
    }
  };

  const handleConcealEvent = async () => {
    if (!selectedEvent) return;

    try {
      // Etkinliği gizleme isteği
      const response = await fetch('/conceal_event', {
        method: 'POST',
        body: JSON.stringify({ eventId: selectedEvent.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log('Etkinlik başarıyla gizlendi!');
        setSnackbarMessage('Etkinlik başarıyla gizlendi!');
        setSnackbarOpen(true);

        // Gizlenen etkinliği listeden çıkar (veya gizle)
        setFilteredEvents(filteredEvents.filter(event => event.id !== selectedEvent.id));
      } else {
        console.error('Etkinlik gizlenemedi!');
        setSnackbarMessage('Etkinlik gizlenemedi!');
        setSnackbarOpen(true);
      }

      handleClose();
    } catch (error) {
      console.error('Hata:', error);
      setSnackbarMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="event-list-container">
      <Typography variant="h4" align="center" style={{ color: 'white' }} gutterBottom>
        <Navbar />
        <h1 style={{
          color: 'white',
          position: 'absolute',
          marginLeft: '100px',
          top: '80px',
          fontSize: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop:'0px',
          marginBottom: '40px' 
        }}>
          All Events Here!
        </h1>
      </Typography>

      <Grid container spacing={3} style={{ marginTop: '100px' }}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
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
              <Typography variant="body1"><strong>Açıklama:</strong> {selectedEvent.description}</Typography>
              <Typography variant="body1"><strong>Tarih:</strong> {selectedEvent.date}</Typography>
              <Typography variant="body1"><strong>Saat:</strong> {selectedEvent.time}</Typography>
              <Typography variant="body1"><strong>Lokasyon:</strong> {selectedEvent.location}</Typography>
              <Typography variant="body1"><strong>Süre:</strong> {selectedEvent.duration}</Typography>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={markerPosition}
                zoom={13}
                onLoad={(mapInstance) => setMap(mapInstance)}
              ></GoogleMap>

              {/* Delete and Conceal Buttons */}
              <Box display="flex" justifyContent="space-around" marginTop={2}>
                <Button variant="contained" color="secondary" onClick={handleDeleteEvent}>
                  Etkinliği Sil
                </Button>
                <Button variant="contained" color="primary" onClick={handleConcealEvent}>
                  Etkinliği Gizle
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // 3 saniye sonra kapanacak
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default AdminAllEvents;
