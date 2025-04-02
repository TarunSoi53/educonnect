// Inside your utils/auth.js

import api from './api'; // Your Axios instance

export const initializeAuthState = async (login, logout) => {
  const token = localStorage.getItem('token');
  console.log("Checking for token on load:", token);

  if (token) {
    try {
      console.log("Token found, verifying with backend...");
      const response = await api.get('/api/auth/verify');

      if (response.data && response.data.user) {
        console.log("Backend verification successful:", response.data.user);
        login(token, response.data.user);
      } else {
        console.log("Backend verification failed or returned no user.");
        localStorage.removeItem('token');
        logout();
      }
    } catch (error) {
      console.error('Failed to initialize auth state:', error);
      localStorage.removeItem('token');
      logout();
    }
  } else {
    console.log("No token found in localStorage.");
    // Optional: Call logout() to ensure state is cleared
    // logout();
  }
};