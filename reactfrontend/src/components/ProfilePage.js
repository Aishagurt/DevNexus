import React, { useEffect, useState } from 'react';
import { Avatar, Box, Container, Paper, Typography, Divider, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from './Navbar';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: '',
    surname: '',
    email: '',
    birthDate: '',
    password: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/update/${user.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setIsEditing(false);
      } else {
        console.error('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  useEffect(() => {
    const userEmail = localStorage.getItem('email');

    if (userEmail) {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch(`http://localhost:8080/user/${userEmail}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            console.error('Failed to fetch user details');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      fetchUserDetails();
    }
  }, []);

  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar sx={{ width: 100, height: 100, bgcolor: 'black', color: 'white' }}>
              {user.name && user.surname ? `${user.name[0]}${user.surname[0]}` : ''}
            </Avatar>
          </Box>
          {!isEditing ? (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" color="textPrimary">
                {user.name} {user.surname}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {user.email}
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<EditIcon />}
                sx={{ border: '1px solid #ccc', textTransform: 'none', borderRadius: 0, marginTop: '20px' }}
                onClick={handleEdit}
              >
                Edit Profile
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSaveChanges}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <TextField
                  label="Name"
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="Surname"
                  name="surname"
                  value={user.surname}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="Birth Date"
                  name="birthDate"
                  value={user.birthDate}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <input type="hidden" name="password" value={user.password} />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: '20px' }}
                >
                  Save Changes
                </Button>
              </Box>
            </form>
          )}
          <Divider sx={{ width: '100%' }} />
        </Paper>
      </Container>
    </>
  );
};

export default ProfilePage;
