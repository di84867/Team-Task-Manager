import axios from 'axios';

// When deployed, we use a relative path. In development, we talk to localhost:5000.
const isDev = import.meta.env.MODE === 'development';
const baseURL = isDev ? 'http://localhost:5000/api' : '/api';

const API = axios.create({
    baseURL: baseURL,
});

// Automatically add JWT token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
