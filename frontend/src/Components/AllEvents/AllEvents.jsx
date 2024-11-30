import React, { useEffect, useState } from 'react';
import './AllEvents.css';
import { Grid, Paper, Typography, Modal, Button, Box, Snackbar, Tabs, Tab } from '@mui/material';
import { GoogleMap } from '@react-google-maps/api';
import Navbar from '../Navbar/Navbar';
import UserCard from '../UserCard/Usercard.jsx'
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

const AllEvents = () => {
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
  const [tabValue, setTabValue] = useState(0);
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

  useEffect(() => {
    const userId = getUserDataFromCookies();

    if (userId) {
      fetch(`/get_user_info?user_id=${userId}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setUserData(data.user);
          } else {
            console.log(data.message);
          }
        })
        .catch(error => console.error('Error fetching user data:', error));
    } else {
      console.log("No user ID found in cookies");
    }
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

  const filterEvents = (events, tabIndex) => {
    const now = new Date();
    if (tabIndex === 0) {
      // Filter upcoming events
      const upcoming = events.filter((event) => new Date(event.date) >= now);
      setFilteredEvents(upcoming);
    }/* else if (tabIndex === 1) {
      // Filter past events
      const past = events.filter((event) => new Date(event.date) < now);
      setFilteredEvents(past);
    }*/
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

  const handleJoin = async () => {
    if (!selectedEvent) return;
  
    try {
      const userId = getUserDataFromCookies();
      if (!userId) {
        console.error("User ID bulunamadı.");
        setSnackbarMessage("Kullanıcı bilgileri bulunamadı. Lütfen giriş yapın.");
        setSnackbarOpen(true);
        return;
      }
  
      const joinedEventsResponse = await fetch(`/get_joined_events`, {
        method: 'GET',
        credentials: 'include',
      });
      const joinedEventsData = await joinedEventsResponse.json();
  
      if (joinedEventsData.events) {
        const joinedEvents = joinedEventsData.events;
  
        const selectedEventDate = new Date(`${selectedEvent.date}T${selectedEvent.time}`);
        const hasConflict = joinedEvents.some(event => {
          const eventDate = new Date(`${event.date}T${event.time}`);
          return eventDate.getTime() === selectedEventDate.getTime();
        });
  
        if (hasConflict) {
          setSnackbarMessage("Aynı tarih ve saatte bir etkinliğiniz zaten mevcut.");
          setSnackbarOpen(true);
          return;
        }
      }
  
      const joinResponse = await fetch('/join_event', {
        method: 'POST',
        body: JSON.stringify({ eventId: selectedEvent.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const joinData = await joinResponse.json();
      if (joinData.success) {
        console.log('Etkinliğe başarıyla katıldınız!');
        setSnackbarMessage('Etkinliğe başarıyla katıldınız!');
        setSnackbarOpen(true);
      } else {
        console.error('Katılma işlemi başarısız oldu!');
        setSnackbarMessage('Katılma işlemi başarısız oldu.');
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

  const handleLogout = () => {
    document.cookie = `user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `remember_me=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    navigate('/login');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    filterEvents(events, newValue);
  };

  return (
    <div className="event-list-container">
      {userData ? (
          <UserCard userData={userData} handleLogout={handleLogout} />
        ) : (
          <p>No user data found.</p>
        )}

      <Typography variant="h4" align="center" style={{color:'white'}}gutterBottom>
        <Navbar />
        <h1 style={{
          color: 'white',
          position: 'absolute',
          top: '80px',
          fontSize: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '10px' 
        }}>
          All Events Here!
        </h1>
      </Typography>

      <Tabs
        centered
        className='my-events-tabs'
        sx={{
          '& .MuiTab-root': {
            backgroundColor: 'transparent',
            color: 'white',
            textTransform: 'none',
            fontWeight: 'bold',
            border: '1px solid #ccc',
            borderRadius: '4px',
            margin: '0 5px',
            marginLeft: '20px',
            marginBottom: '0px',
            width: '1400px',
            height: '50px',
            visibility: 'hidden',
            pointerEvents: 'none',
          },
          '& .Mui-selected': {
            backgroundColor: 'white',
            color: 'black',
            visibility: 'hidden',
            pointerEvents: 'none',
          },
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          marginTop: -50
        }}
      >
        <Tab label="Upcoming Events" />
        <Tab label="Past Events" />
      </Tabs>

      <Grid container spacing={3}>
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
              <Typography variant="h6" align="center" marginBottom={2} marginTop={2}><strong>{selectedEvent.event_name}</strong></Typography>
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
              <Button variant="contained" color="primary" onClick={handleJoin}>Katıl</Button>
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

export default AllEvents;
