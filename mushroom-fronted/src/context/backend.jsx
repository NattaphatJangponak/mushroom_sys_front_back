// import axios from 'axios';

// const backend = axios.create({
//   baseURL: "http://172.17.64.1:1880",
//   // baseURL: "http://localhost:5000",
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default backend;

import axios from 'axios';

const backend = axios.create({
  baseURL: import.meta.env.VITE_NODE_RED, // 🔁 ใช้จาก .env
  headers: {
    'Content-Type': 'application/json',
  },
});

export default backend;
