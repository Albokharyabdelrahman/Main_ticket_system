import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    verifyToken(); // no need to pass token here anymore
  } else {
    setAuthState(prev => ({ ...prev, isLoading: false }));
  }
}, []);


  const verifyToken = async (token) => {
    try {
      const response = await axios.get("http://localhost:7000/api/v1");
      setAuthState({
        isAuthenticated: true,
        user: response.data.user,
        isLoading: false
      });
    } catch (err) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      });
    }
  };

  const login = (token, user) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setAuthState({
      isAuthenticated: true,
      user: user,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  };

  // Add this register function:
  const register = async (formData) => {
    // Pass FormData directly if you send multipart/form-data
    return axios.post("http://localhost:7000/api/v1/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};