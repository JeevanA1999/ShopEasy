
import React, { useState } from 'react';
import { AppThemeProvider } from "./contexts_ providers/AppThemeProvider";
import { AuthProvider } from "./contexts_ providers/AuthProvider";
import { useAuth } from './contexts/AuthContext';
import { LoginPage, Dashboard, ProductDetailsPage, CartPage } from "./components";

const AppContent = () => {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const cartItemsCount = useAuth().getCartItemsCount();

  
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentView('productDetails');
  };

  const handleCartClick = () => {
    setCurrentView('cart');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProduct(null);
  };

 
  if (!currentUser) {
    return <LoginPage />;
  }


  switch (currentView) {
    case 'productDetails':
      return (
        <ProductDetailsPage
          product={selectedProduct}
          onBack={handleBackToDashboard}
          onCartClick={handleCartClick}
          cartItemsCount={cartItemsCount}
        />
      );
    case 'cart':
      return (
        <CartPage
          onBack={handleBackToDashboard}
          onCartClick={handleCartClick}
          cartItemsCount={cartItemsCount}
        />
      );
    default:
      return (
        <Dashboard
          onProductClick={handleProductClick}
          onCartClick={handleCartClick}
          cartItemsCount={cartItemsCount}
        />
      );
  }
};


export default function EcommerceApp() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppThemeProvider>
  );
}