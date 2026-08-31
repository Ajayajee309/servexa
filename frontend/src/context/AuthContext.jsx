import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set default axios header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      
      // Basic decoding to get user info if we just have token (or assume login sets it)
      // For now, we will rely on login/register responses to set the full user object
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8088/api/auth/login', { email, password });
      const { token: jwt, id, fullName, email: userEmail, role } = response.data;
      
      const userData = { id, fullName, email: userEmail, role };
      setUser(userData);
      setToken(jwt);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      await axios.post('http://localhost:8088/api/auth/register', userData);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      
      if (!error.response) {
        return { success: false, message: 'Network error: Make sure the Backend server is running!' };
      }
      
      // Handle Spring Validation Errors
      if (error.response.data && error.response.data.errors) {
        const firstError = error.response.data.errors[0];
        return { success: false, message: `Validation Error: ${firstError.field} ${firstError.defaultMessage}` };
      }
      
      return { success: false, message: error.response?.data?.message || 'Registration failed. Check console for details.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
