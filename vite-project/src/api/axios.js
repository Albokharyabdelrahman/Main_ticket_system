import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:7000/api', // change if needed
  withCredentials: true, // for cookie-based JWT sessions
});

export default instance;