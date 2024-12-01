import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Tabs, Tab, Modal, Box, Button } from '@mui/material';

const Eventsdateinfo = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    filterEvents(events, newValue);
  };

  const handleOpen = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  };

  const Eventsdateinfo = () => {
    return <div>Event Date Information</div>;
};

  return (
    <div>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        centered
        sx={{
          '& .MuiTab-root': {
            backgroundColor: 'transparent',
            color: 'white',
            textTransform: 'none',
            fontWeight: 'bold',
            border: '1px solid #ccc',
            borderRadius: '4px',
            margin: '0 5px',
            minWidth: '150px',
          },
          '& .Mui-selected': {
            backgroundColor: 'white',
            color: 'black',
          },
          marginBottom: '20px',
        }}
      >
        <Tab label="Upcoming Events" />
        <Tab label="Past Events" />
      </Tabs>

      {/* Event List */}
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

      {/* Modal for Event Details */}
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '4px',
          }}
        >
          {selectedEvent && (
            <>
              <Typography variant="h6" id="event-modal-title">
                {selectedEvent.event_name}
              </Typography>
              <Typography variant="body1" id="event-modal-description">
                Date: {selectedEvent.date}
              </Typography>
              <Typography variant="body1">
                Time: {selectedEvent.time}
              </Typography>
              <Typography variant="body1" sx={{ marginTop: '10px' }}>
                Description: {selectedEvent.description}
              </Typography>
              <Button
                onClick={handleClose}
                variant="contained"
                sx={{ marginTop: '20px' }}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Eventsdateinfo;
