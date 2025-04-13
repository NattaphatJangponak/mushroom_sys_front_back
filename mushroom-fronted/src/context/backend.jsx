import axios from 'axios';

const backend = axios.create({
  baseURL: "http://49.0.81.242:1880",
  // baseURL: "http://localhost:5000",
  headers: {
    'Content-Type': 'application/json',
  },
});

export default backend;