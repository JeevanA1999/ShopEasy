import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  Stack
} from '@mui/material';
import { ArrowBack, Add, Remove, Delete, ShoppingCart } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { Header } from './Header';

export const CartPage = ({ onBack, onCartClick, cartItemsCount }) => {
  const { currentCart, updateCartItemQuantity, removeFromCart, placeOrder, getTotalCartValue } = useAuth();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handlePlaceOrder = () => {
    if (currentCart.length === 0) {
      setSnackbar({
        open: true,
        message: 'Your cart is empty',
        severity: 'warning'
      });
      return;
    }

    placeOrder();
    setSnackbar({
      open: true,
      message: 'Order placed successfully! 🎉',
      severity: 'success'
    });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  if (currentCart.length === 0) {
    return (
      <Box>
        <Header onCartClick={onCartClick} cartItemsCount={cartItemsCount} />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 120, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h4" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button variant="contained" size="large" onClick={onBack}>
            Start Shopping
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Header onCartClick={onCartClick} cartItemsCount={cartItemsCount} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onBack}
            variant="outlined"
          >
            Continue Shopping
          </Button>
          <Typography variant="h4" sx={{ ml: 3, flexGrow: 1 }}>
            Shopping Cart ({cartItemsCount} items)
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2}>
              <List>
                {currentCart.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemAvatar sx={{ mr: 2 }}>
                        <Avatar
                          src={item.image}
                          alt={item.name}
                          variant="rounded"
                          sx={{ width: 80, height: 80 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary">
                              {item.category} • {item.brand}
                            </Typography>
                            <Typography variant="h6" color="primary">
                              ₹{item.price?.toFixed(2)} each
                            </Typography>
                          </Stack>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            color="primary"
                          >
                            <Remove />
                          </IconButton>
                          <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            color="primary"
                          >
                            <Add />
                          </IconButton>
                        </Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ minWidth: 100, textAlign: 'right' }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                        <IconButton
                          onClick={() => handleQuantityChange(item.id, 0)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < currentCart.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Stack spacing={2}>
                {currentCart.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      {item.name} x {item.quantity}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">
                    Total ({cartItemsCount} items)
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ₹{getTotalCartValue().toFixed(2)}
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handlePlaceOrder}
                  sx={{ py: 2, mt: 3 }}
                >
                  Place Order
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartPage;