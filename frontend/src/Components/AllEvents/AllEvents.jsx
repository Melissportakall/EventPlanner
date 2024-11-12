import React, { useEffect, useState } from 'react';
import './AllEvents.css'; // Stil dosyası
import { Grid, Paper, Typography, Modal, Button, Box, Snackbar } from '@mui/material';  // MUI bileşenlerini import ediyoruz

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Seçilen etkinlik için state
  const [open, setOpen] = useState(false); // Modal'ın açık/kapalı durumu
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar açık/kapalı durumu
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar mesajı

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

  const handleOpen = (event) => {
    setSelectedEvent(event);
    setOpen(true); // Modal'ı aç
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
