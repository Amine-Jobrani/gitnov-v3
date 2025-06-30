// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Your API's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('firebaseIdToken');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;