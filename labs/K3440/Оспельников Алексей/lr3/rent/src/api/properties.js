// src/api/properties.js
import axios from 'axios';
const API_URL = 'http://localhost:8000';

export const getProperties = async () => {
  const res = await axios.get(`${API_URL}/properties`);
  return res.data;
};
