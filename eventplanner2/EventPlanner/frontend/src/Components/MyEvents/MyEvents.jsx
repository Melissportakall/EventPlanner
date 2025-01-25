import React, { useEffect, useState, useRef } from 'react';
import { Grid, Paper, Typography, Modal, Button, Box, Snackbar, Tabs, Tab, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { GoogleMap } from '@react-google-maps/api';
import Navbar from '../Navbar/Navbar';
import './MyEvents.css';
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


const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 41.015137, lng: 28.979530 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [startingPoint, setStartingPoint] = useState('');
  const [travelMode, setTravelMode] = useState('DRIVING'); //varsayılan
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'My Events';

    fetch('/get_joined_events')
      .then((response) => response.json())
      .then((data) => {
        if (data.events) {
          setEvents(data.events);
          filterEvents(data.events, 0);
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

  const filterEvents = (events, tabIndex) => {
    const now = new Date();
    if (tabIndex === 0) {
      const upcoming = events.filter((event) => new Date(event.date) >= now);
      setFilteredEvents(upcoming);
    } else if (tabIndex === 1) {
      const past = events.filter((event) => new Date(event.date) < now);
      setFilteredEvents(past);
    }
  };

  useEffect(() => {
    const loadMapScript = () => {
      if (window.google) {
        setIsLoaded(true);
      } else {
        console.error('Google Maps API yüklenemedi.');
      }
    };

    if (window.google) {
      loadMapScript();
    } else {
      window.addEventListener('load', loadMapScript);
      return () => {
        window.removeEventListener('load', loadMapScript);
      };
    }
  }, []);

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    filterEvents(events, newValue);
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

  const handleLeaveEvent = (eventId) => {
    fetch('/delete_point', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ point: 10 }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('10 puan başarıyla silindi!');
        } else {
          console.error('Puan silme işlemi başarısız oldu!');
          alert(data.message);
        }

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
      })
      .catch((error) => {
        console.error('Error deleting points:', error);
        alert('An error occurred while trying to delete points.');
      });
  };


  const drawRoute = () => {
    const directionsService = new window.google.maps.DirectionsService();

    //önceden render edileni sil
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }

    const newDirectionsRenderer = new window.google.maps.DirectionsRenderer();
    setDirectionsRenderer(newDirectionsRenderer);

    if (map) {
      //renderer'a haritayı ekle
      newDirectionsRenderer.setMap(map);
    }

    directionsService.route(
      {
        origin: startingPoint,
        destination: selectedEvent.location,
        travelMode: travelMode || 'DRIVING', //varsayılan
      },
      (result, status) => {
        if (status === 'OK') {
          //yeni rota çiz
          newDirectionsRenderer.setDirections(result);
        } else {
          console.error('Error fetching directions:', status);
          setSnackbarMessage('Could not find a route. Please check your input.');
          setSnackbarOpen(true);
        }
      }
    );
  };

  const handleOpen = (event) => {
    setSelectedEvent(event);
    setOpen(true);

    if (event.location) {
      fetchCoordinates(event.location);
    }
  };

  const handleClose = () => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleLogout = () => {
    document.cookie = `user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `remember_me=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    navigate('/login');
  };

  return (
    <div className="event-list-container">
      {userData ? (
        <UserCard userData={userData} handleLogout={handleLogout} />
      ) : (
        <p>No user data found.</p>
      )}
      <Typography variant="h4" align="center" style={{ color: 'white',marginBottom: '0px'  }} gutterBottom={false}>
        <Navbar />
        <h1 style={{
          color: 'white',
          position: 'absolute',
          top: '80px',
          fontSize: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '5px'
        }}>
          My Events
        </h1>
      </Typography>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
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
          },
          '& .Mui-selected': {
            backgroundColor: 'white',
            color: 'black',
          },
          marginBottom: '50px',
          marginTop: -40
        }}
      >
        <Tab label="Upcoming Events" />
        <Tab label="Past Events" />
      </Tabs>
      <div style={{ width: '1200px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxHeight: '80vh', overflowY: 'auto', width: '100%', justifyContent: 'center' }}>
          <Grid container spacing={2}>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Grid item xs={12} sm="auto" md="auto" key={event.id} style={{ padding: '10px' }}>
                  <Paper
                    elevation={3}
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      width: '220px',
                      height: '250px',
                      borderRadius: '30px',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transition: 'background 0.6s ease',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onClick={() => handleOpen(event)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #dc87ce, #5aaac2)';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
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
        </div>
      </div>

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
              <Typography variant="body1"><strong>Kategori:</strong> {selectedEvent.category}</Typography>
              <Typography variant="body1">
                <strong>Location:</strong> {selectedEvent.location}
              </Typography>

              {/* Google Map */}
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={markerPosition}
                zoom={13}
                onLoad={(mapInstance) => setMap(mapInstance)}
              ></GoogleMap>

              {/* Starting Point and Travel Mode */}
              <Grid container spacing={2} marginTop={2}>
                {/* Starting Point */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Starting Point"
                    variant="outlined"
                    fullWidth
                    value={startingPoint}
                    onChange={(e) => setStartingPoint(e.target.value)}
                  />
                </Grid>

                {/* Travel Mode */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="travel-mode-label">Travel Mode</InputLabel>
                    <Select
                      labelId="travel-mode-label"
                      value={travelMode}
                      onChange={(e) => setTravelMode(e.target.value)}
                    >
                      <MenuItem value="DRIVING">Driving</MenuItem>
                      <MenuItem value="WALKING">Walking</MenuItem>
                      <MenuItem value="TRANSIT">Transit</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                onClick={drawRoute}
                style={{
                  marginTop: '10px',
                  marginRight: '10px',
                  backgroundColor: '#1976d2', 
                  color: '#fff',
                }}
              >
                Get Directions
              </Button>

              {/* Leave Event Button */}
              <Button
                variant="contained"
                style={{
                  marginTop: '10px',
                  backgroundColor: 'red',
                  color: 'white',
                }}
                onClick={() => handleLeaveEvent(selectedEvent?.id)}
              >
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
