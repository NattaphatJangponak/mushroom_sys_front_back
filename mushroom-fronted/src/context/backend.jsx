import axios from 'axios';

const backend = axios.create({
  baseURL: "http://192.168.237.130:1880",
  // baseURL: "http://localhost:5000",
  headers: {
    'Content-Type': 'application/json',
  },
});

export default backend;