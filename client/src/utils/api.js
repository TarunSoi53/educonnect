import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request sent:', config);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response && error.response.status === 401) {
      console.log("unauthorized access, redirecting to login");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api; 