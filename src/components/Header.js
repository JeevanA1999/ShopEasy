import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Button,
  Chip,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Store,
  ShoppingCart,
  AccountCircle,
  CloudOff,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { useAppTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export const Header = ({ onCartClick, cartItemsCount, isOffline, onRetryConnection }) => {
  const { darkMode, toggleDarkMode } = useAppTheme();
  const { currentUser, logout } = useAuth();

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <Store sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ShopEasy Store
          {isOffline && (
            <Chip 
              label="Offline" 
              size="small" 
              icon={<CloudOff />} 
              sx={{ ml: 1 }} 
              variant="outlined" 
              color="warning"
            />
          )}
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              icon={<Brightness7 />}
              checkedIcon={<Brightness4 />

              }
            />
          }
          label=""
          sx={{ mr: 2 }}
        />

        {currentUser && (
          <>
            <IconButton
              color="inherit"
              onClick={onCartClick}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={cartItemsCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <Button
              color="inherit"
              startIcon={<AccountCircle />}
              onClick={logout}
            >
              {currentUser.name}
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};