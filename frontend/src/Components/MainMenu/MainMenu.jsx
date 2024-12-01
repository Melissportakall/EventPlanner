import React, { useEffect, useState } from 'react';
import './Card.css';
import ReactDOM from "react-dom";
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Modal, Button, Box, Snackbar, Tabs, Tab } from '@mui/material';
import { GoogleMap } from '@react-google-maps/api';
import AllEvents from '../AllEvents/AllEvents';
import Navbar from '../Navbar/Navbar';
import UserCard from '../UserCard/Usercard.jsx'

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

const MainMenu = () => {
  const [userData, setUserData] = useState(null);
  const [interestedCategories, setInterestedCategories] = useState({});
  const [interestedEvents, setInterestedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 41.015137, lng: 28.979530 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

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
    setOpen(true);

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

  useEffect(() => {
    document.title = 'Main Menu';

    const fetchUserData = async () => {
        const userId = getUserDataFromCookies();
        if (!userId) return;

        try {
            const userInfoResponse = await fetch(`/get_user_info?user_id=${userId}`, {
                method: 'GET',
                credentials: 'include',
            });
            const userInfo = await userInfoResponse.json();

            if (userInfo.success) {
                setUserData(userInfo.user);

                const joinedEventsResponse = await fetch(`/get_joined_events`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const joinedEventsData = await joinedEventsResponse.json();

                if (joinedEventsData.events) {
                    const now = new Date();
                    const pastEvents = joinedEventsData.events.filter(event => {
                        const eventDate = new Date(`${event.date}T${event.time}`);
                        return eventDate < now;
                    });

                    const categoryFrequency = {};

                    pastEvents.forEach(event => {
                        if (event.category) {
                            let categories = [];

                            try {
                                categories = JSON.parse(event.category);
                            } catch (error) {
                                categories = event.category.split(',').map(cat => cat.trim());
                            }

                            categories.forEach(category => {
                                const categoryName = Array.isArray(category) ? category.join(", ") : category;

                                categoryFrequency[categoryName] = (categoryFrequency[categoryName] || 0) + 1;
                            });
                        }
                    });

                    if (userInfo.user.interests) {
                        let interestsArray;

                        try {
                            interestsArray = JSON.parse(userInfo.user.interests);
                        } catch (error) {
                            interestsArray = userInfo.user.interests.split(',').map(interest => interest.trim());
                        }

                        interestsArray.forEach(interest => {
                            categoryFrequency[interest] = (categoryFrequency[interest] || 0) + 1;
                        });
                    }

                    console.log("Profil kategorileri: ", categoryFrequency);

                    setInterestedCategories(categoryFrequency);

                    const allEventsResponse = await fetch(`/get_all_events`, {
                      method: 'GET',
                      credentials: 'include',
                    });
                    const allEventsData = await allEventsResponse.json();
                    
                    if (allEventsData.events) {
                      const futureEvents = allEventsData.events.filter(event => {
                        const eventDate = new Date(`${event.date}T${event.time}`);
                        return eventDate >= now;
                      });
                    
                      console.log("Future events before excluding joined:", futureEvents);
                    
                      const joinedEventIds = joinedEventsData.events.map(event => event.id);
                    
                      const futureEventsExcludingJoined = futureEvents.filter(event => !joinedEventIds.includes(event.id));
                    
                      console.log("Future events after excluding joined:", futureEventsExcludingJoined);
                    
                      const filteredEvents = futureEventsExcludingJoined.filter(event => {
                        let eventCategories = [];
                    
                        try {
                          eventCategories = JSON.parse(event.category);
                        } catch {
                          console.error(`Failed to parse category for event: ${event.event_name}`);
                        }
                    
                        return eventCategories.some(category => categoryFrequency[category]);
                      });
                    
                      setInterestedEvents(filteredEvents);
                  }                  
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchUserData();
  }, []);

  return (
    <div style={{ color: 'white' }}>
      <Navbar />
        {userData ? (
          <UserCard userData={userData} handleLogout={() => navigate('/login')} />
        ) : (
          <p>No user data found.</p>
        )}

      <Typography
        variant="h4"
        align="center"
        style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '50px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)',
          marginBottom: '10px',
          letterSpacing: '1px',
        }}
      >
        Discover the Events You Love!

          <Typography
          variant="body1"
          align="center"
          style={{
            fontSize: '18px',
            fontWeight: '300',
            color: '#FFFFFF',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.9)',
            marginTop: '5px',
          }}
        >
          Explore personalized events tailored just for you. Let the fun begin!
        </Typography>
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

        <div style={{ width: '710px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxHeight: '80vh', overflowY: 'auto', width: '100%', justifyContent: 'center' }}>
          <Grid container spacing={2}>
            {interestedEvents.length > 0 ? (
              interestedEvents.map((event) => (
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
                <Typography variant="body1"><strong>Kategori:</strong> {selectedEvent.category}</Typography>
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

export default MainMenu;
