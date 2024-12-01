import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Modal, Box, Button, Snackbar, Tabs, Tab } from '@mui/material';
import Navbar from '../AdminNavbar/AdminNavbar';

const AdminAllUsers = () => {
  const [users, setUsers] = useState([]); // users için state
  const [selectedUser, setSelectedUser] = useState(null); // seçilen kullanıcı
  const [open, setOpen] = useState(false); // Modal açık/kapalı durumu
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar açık/kapalı durumu
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar mesajı

  useEffect(() => {
    document.title = 'All Users';

    fetch('/get_all_users')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Admin kullanıcıları filtreleme
          const filteredUsers = data.users.filter(
            (user) => user.kullanici_adi !== 'admin' && user.sifre !== 'admin'
          );
          setUsers(filteredUsers); // Filtrelenmiş kullanıcıları state'e kaydet
        } else {
          console.error('Error fetching users:', data.message);
        }
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setOpen(true); // Modal'ı aç
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null); // Modal'ı kapat
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Snackbar'ı kapat
  };

  return (
    <div className="admin-verify-container">
      <Typography variant="h4" align="center" style={{ color: 'white' }} gutterBottom>
        <Navbar />
        <h1
          style={{
            color: 'white',
            position: 'absolute',
            top: '80px',
            fontSize: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '10px',
          }}
        >
          All Users Here!
        </h1>
      </Typography>

      <Tabs
        centered
        className="my-events-tabs"
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
          marginTop: -50,
        }}
      >
        <Tab label="All Users" />
        <Tab label="All Users" />
      </Tabs>

      <Grid container spacing={3}>
        {users.length > 0 ? (
          users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Paper
                elevation={3}
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  minHeight: '250px',
                  borderRadius: '25px',
                  backgroundColor: 'white',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  width: '250px',
                  marginTop: '20px',
                  marginBottom: '20px',
                  marginLeft: '20px',
                  marginRight: '20px',
                  transition: 'background 0.6s ease',
                }}
                onClick={() => handleOpen(user)} // Kullanıcı detayları için aç
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #dc87ce, #5aaac2)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <Typography variant="h6">{user.kullanici_adi}</Typography>
                <Typography color="textSecondary">{user.ad} {user.soyad}</Typography>
                <Typography color="textSecondary">{user.eposta}</Typography>
                <Typography>{user.konum || 'Konum belirtilmemiş'}</Typography>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" align="center">
            No users found.
          </Typography>
        )}
      </Grid>

      {/* Modal for User Details */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box className="modal-box" sx={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px' }}>
          {selectedUser && (
            <>
              <Typography variant="h6" style={{marginBottom: '10px'}}>User Details</Typography>
              <Typography><strong>Name:</strong> {selectedUser.ad} {selectedUser.soyad}</Typography>
              <Typography><strong>Username:</strong> {selectedUser.kullanici_adi}</Typography>
              <Typography><strong>Email:</strong> {selectedUser.eposta}</Typography>
              <Typography><strong>Phone:</strong> {selectedUser.telefon_no}</Typography>
              <Typography><strong>Location:</strong> {selectedUser.konum || 'Not specified'}</Typography>
              <Typography><strong>Interests:</strong> {selectedUser.ilgi_alanlari || 'Not specified'}</Typography>
              <Typography><strong>Gender:</strong> {selectedUser.cinsiyet || 'Not specified'}</Typography>
              <Typography><strong>Birth Date:</strong> {selectedUser.dogum_tarihi || 'Not specified'}</Typography>
              <Button onClick={handleClose} color="primary" style={{ marginTop: '20px' }}>
                Close
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

export default AdminAllUsers;
