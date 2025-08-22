import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Paper
} from '@mui/material';
import { Store, Login } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { id: 1, username: 'jeevan_A', name: 'Jeevan A', avatar: 'JK' },
    { id: 2, username: 'jithesh_A', name: 'Jithesh A', avatar: 'JA' },
    { id: 3, username: 'mokshith', name: 'Mokshith K', avatar: 'MK' },
    { id: 4, username: 'sujith', name: 'Sujith', avatar: 'SJ' },
    { id: 5, username: 'sachith', name: 'Sachith K', avatar: 'SK' }
  ];

  const handleLogin = () => {
    if (selectedUser) {
      login(selectedUser);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 6,
            borderRadius: 4,
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Store sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            ShopEasy Store
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Select your account to continue
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            {users.map((user) => (
              <Grid item xs={6} key={user.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: selectedUser?.id === user.id ? 2 : 0,
                    borderColor: 'primary.main',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 8,
                    },
                  }}
                  onClick={() => setSelectedUser(user)}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        margin: '0 auto 16px',
                        bgcolor: 'primary.main',
                      }}
                    >
                      {user.avatar}
                    </Avatar>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{user.username}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={!selectedUser}
            onClick={handleLogin}
            startIcon={<Login />}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              borderRadius: 2,
            }}
          >
            Login as {selectedUser?.name}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};