import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import { CloudOff, Refresh } from '@mui/icons-material';

export const ConnectionStatus = ({ isOffline, onRetry }) => {
  if (!isOffline) return null;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        mb: 2, 
        bgcolor: 'warning.light',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
    >
      <CloudOff />
      <Typography variant="body2" sx={{ flexGrow: 1 }}>
        Connection issue detected. Using offline data.
      </Typography>
      <Button
        variant="outlined"
        size="small"
        startIcon={<Refresh />}
        onClick={onRetry}
      >
        Retry
      </Button>
    </Paper>
  );
};