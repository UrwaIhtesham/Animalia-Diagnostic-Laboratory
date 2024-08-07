// src/services/axios.service.js
import axios from 'axios';

const privateAxios = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export { privateAxios };
