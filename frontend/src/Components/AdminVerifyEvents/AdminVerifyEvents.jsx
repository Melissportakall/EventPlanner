import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Modal, Box, Button, Snackbar } from '@mui/material';
import Navbar from '../AdminNavbar/AdminNavbar';

const AdminVerifyEvents = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetch('/get_pending_events')
      .then((response) => response.json())
      .then((data) => {
        if (data.events) {
          setPendingEvents(data.events);
        } else {
          console.error('Error fetching events:', data.message);
        }
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleOpen = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleApprove = async () => {
    if (!selectedEvent) return;

    try {
      const response = await fetch('/approve_event', {
        method: 'POST',
        body: JSON.stringify({ eventId: selectedEvent.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setSnackbarMessage('Event approved successfully.');
        setPendingEvents((prev) =>
          prev.filter((event) => event.id !== selectedEvent.id)
        );
      } else {
        setSnackbarMessage(data.message || 'Error approving event.');
      }
    } catch (error) {
      console.error('Error approving event:', error);
      setSnackbarMessage('Error approving event. Please try again.');
    }

    setSnackbarOpen(true);
    handleClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="admin-verify-container">
      <Navbar />
      <Typography variant="h4" align="center" gutterBottom>
        Pending Events
      </Typography>

      <Grid container spacing={3}>
        {pendingEvents.length > 0 ? (
          pendingEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Paper
                elevation={3}
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => handleOpen(event)}
              >
                <Typography variant="h6">{event.event_name}</Typography>
                <Typography color="textSecondary">{event.date}</Typography>
                <Typography color="textSecondary">{event.time}</Typography>
                <Typography>{event.category}</Typography>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" align="center">
            No pending events found.
          </Typography>
        )}
      </Grid>

      {/* Modal for Event Details */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box className="modal-box">
          {selectedEvent && (
            <>
              <Typography variant="h6" align="center" marginBottom={2}>
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
              <Typography variant="body1">
                <strong>Duration:</strong> {selectedEvent.duration}
              </Typography>
              <Typography variant="body1">
                <strong>Category:</strong> {selectedEvent.category}
              </Typography>
              <Button variant="contained" color="primary" onClick={handleApprove}>
                Approve Event
              </Button>
            </>
          )}
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default AdminVerifyEvents;
