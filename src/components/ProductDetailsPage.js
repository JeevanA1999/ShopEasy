import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Stack,
  Chip,
  List,
  ListItem,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import { ArrowBack, Add, Remove, Delete, ShoppingCart } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { Header } from './Header'

 export const ProductDetailsPage = ({ product, onBack, onCartClick, cartItemsCount }) => {
  const { addToCart, getCartItemQuantity, updateCartItemQuantity, removeFromCart } = useAuth();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const currentQuantity = getCartItemQuantity(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    setSnackbar({
      open: true,
      message: `${product.name} added to cart`,
      severity: 'success'
    });
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(product.id);
      setSnackbar({
        open: true,
        message: `${product.name} removed from cart`,
        severity: 'info'
      });
    } else {
      updateCartItemQuantity(product.id, newQuantity);
    }
  };

  return (
    <Box>
      <Header onCartClick={onCartClick} cartItemsCount={cartItemsCount} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ mb: 3 }}
          variant="outlined"
        >
          Back to Products
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={4}>
              <CardMedia
                component="img"
                height="500"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip label={product.category} color="secondary" />
                  {product.isLocalProduct && (
                    <Chip label="Local Product" color="success" variant="outlined" />
                  )}
                </Stack>
                <Typography variant="h3" component="h1" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
                  ₹{product.price?.toFixed(2)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {product.description}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Product Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Brand: <strong>{product.brand}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Rating: <strong>⭐ {product.rating}/5.0</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Stock: <strong>{product.stock} available</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      GTIN: <strong>{product.gtin}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Key Features
                </Typography>
                <List dense>
                  {product.features?.map((feature, index) => (
                    <ListItem key={index} disableGutters>
                      <Typography variant="body2">• {feature}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Paper elevation={2} sx={{ p: 3 }}>
                {currentQuantity > 0 ? (
                  <Stack spacing={2}>
                    <Typography variant="h6">
                      In Cart: {currentQuantity} items
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <IconButton
                        onClick={() => handleQuantityChange(currentQuantity - 1)}
                        color="primary"
                      >
                        <Remove />
                      </IconButton>
                      <Typography variant="h5" sx={{ minWidth: 40, textAlign: 'center' }}>
                        {currentQuantity}
                      </Typography>
                      <IconButton
                        onClick={() => handleQuantityChange(currentQuantity + 1)}
                        color="primary"
                      >
                        <Add />
                      </IconButton>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleQuantityChange(0)}
                        startIcon={<Delete />}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Stack>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    sx={{ py: 2 }}
                  >
                    Add to Cart
                  </Button>
                )}
              </Paper>
            </Stack>
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

export default ProductDetailsPage;