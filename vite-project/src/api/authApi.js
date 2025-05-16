import axios from './axios';

// Register User
export const registerUser = userData => axios.post('/v1/register', userData);

// Login User
export const loginUser = userData => axios.post('/v1/login', userData);

// Forgot Password (send or verify)
export const forgotPassword = data => axios.put('/v1/forgetPassword', data);