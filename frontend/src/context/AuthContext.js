import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Platform } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Platform specific localhost for Android emulator (10.0.2.2) vs iOS (localhost)
  const API_URL = 'https://digilocker-z2jm.onrender.com/api'; 

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      let token, userData;
      if (Platform.OS === 'web') {
        token = localStorage.getItem('userToken');
        userData = localStorage.getItem('userData');
      } else {
        token = await SecureStore.getItemAsync('userToken');
        userData = await SecureStore.getItemAsync('userData');
      }
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Failed to load user', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user: userData } = res.data;
      
      if (Platform.OS === 'web') {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      }
      
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
      } else {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
      }
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      if (Platform.OS === 'web') {
        localStorage.setItem('userData', JSON.stringify(newUser));
      } else {
        await SecureStore.setItemAsync('userData', JSON.stringify(newUser));
      }
    } catch (e) {
      console.error('Failed to update user context', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
