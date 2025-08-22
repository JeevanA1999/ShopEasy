import React, { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { StorageHelper } from '../services/StorageHelper';
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userCarts, setUserCarts] = useState({});

  // Load persisted data
  useEffect(() => {
    const savedUser = StorageHelper.getItem('currentUser');
    const savedCarts = StorageHelper.getItem('userCarts');

    if (savedUser) setCurrentUser(savedUser);
    if (savedCarts) setUserCarts(savedCarts);
  }, []);

  // Persist data
  useEffect(() => {
    if (currentUser) {
      StorageHelper.setItem('currentUser', currentUser);
    } else {
      StorageHelper.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    StorageHelper.setItem('userCarts', userCarts);
  }, [userCarts]);

  const login = (user) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const getCurrentCart = () => {
    return currentUser ? (userCarts[currentUser.id] || []) : [];
  };

  const addToCart = (product) => {
    if (!currentUser) return;

    setUserCarts(prev => {
      const userCart = prev[currentUser.id] || [];
      const existingItem = userCart.find(item => item.id === product.id);
      
      let updatedCart;
      if (existingItem) {
        updatedCart = userCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...userCart, { ...product, quantity: 1 }];
      }
      
      return {
        ...prev,
        [currentUser.id]: updatedCart
      };
    });
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    if (!currentUser) return;

    setUserCarts(prev => ({
      ...prev,
      [currentUser.id]: prev[currentUser.id].map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    }));
  };

  const removeFromCart = (productId) => {
    if (!currentUser) return;

    setUserCarts(prev => ({
      ...prev,
      [currentUser.id]: prev[currentUser.id].filter(item => item.id !== productId)
    }));
  };

  const getCartItemQuantity = (productId) => {
    const cart = getCurrentCart();
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalCartValue = () => {
    const cart = getCurrentCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    const cart = getCurrentCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = () => {
    if (!currentUser) return;

    setUserCarts(prev => ({
      ...prev,
      [currentUser.id]: []
    }));
  };

  const value = {
    currentUser,
    login,
    logout,
    currentCart: getCurrentCart(),
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    getCartItemQuantity,
    getTotalCartValue,
    getCartItemsCount,
    placeOrder
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};