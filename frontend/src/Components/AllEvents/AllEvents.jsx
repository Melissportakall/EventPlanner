import React, { useEffect, useState } from 'react';
import './AllEvents.css'; // Stil dosyası
import { Grid, Paper, Typography, Modal, Button, Box, Snackbar } from '@mui/material';  // MUI bileşenlerini import ediyoruz
import { GoogleMap } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Seçilen etkinlik için state
  const [open, setOpen] = useState(false); // Modal'ın açık/kapalı durumu
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar açık/kapalı durumu
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar mesajı
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 41.015137, lng: 28.979530 });
  const [marker, setMarker] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    document.title = 'All Events';
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
    fetch('/get_all_events')
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

  const handleOpen = (event) => {
    setSelectedEvent(event);
    setOpen(true); // Modal'ı aç

    if (event.location) {
      fetchCoordinates(event.location);
    }
  };

  const handleClose = () => {
    setOpen(false); // Modal'ı kapat
    setSelectedEvent(null); // Seçilen etkinliği sıfırla
  };

  const handleJoin = async () => {
    if (!selectedEvent) return;

    try {
      const response = await fetch('/join_event', {
        method: 'POST',
        body: JSON.stringify({ eventId: selectedEvent.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log('Etkinliğe başarıyla katıldınız!');
        setSnackbarMessage('Etkinliğe başarıyla katıldınız!');
        setSnackbarOpen(true); // Snackbar'ı göster
      } else {
        console.error('Katılma işlemi başarısız oldu!');
        setSnackbarMessage('Katılma işlemi başarısız oldu.');
        setSnackbarOpen(true); // Snackbar'ı göster
      }

      handleClose(); // Katıldığında modal'ı kapat
    } catch (error) {
      console.error('Hata:', error);
      setSnackbarMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
      setSnackbarOpen(true); // Snackbar'ı göster
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Snackbar'ı kapat
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
      {/* Başlık Ekle */}
      <Typography variant="h4" align="center" style={{color:'white'}}gutterBottom>
        All Events Here!
      </Typography>

      <Grid container spacing={3}>
        {events.length > 0 ? (
          events.map((event) => (
            <Grid item xs={12} sm={4} md={4} key={event.id}>
              <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', cursor: 'pointer', minHeight: '250px' }} onClick={() => handleOpen(event)}>
                <Typography variant="h6">{event.event_name}</Typography>
                <Typography color="textSecondary">{event.date}</Typography>
                <Typography color="textSecondary">{event.time}</Typography>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">Henüz etkinlik bulunmamaktadır.</Typography>
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
