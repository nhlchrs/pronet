import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // Register
  const register = async (firstName, lastName, email, phone, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register({
        fname: firstName,
        lname: lastName,
        email,
        phone,
        password,
      });
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.verifyOTP(email, otp);
      
      // Handle nested response structure: response.data.token or response.token
      const token = response.token || (response.data && response.data.token);
      const user = response.user || (response.data && response.data.user);
      
      if (token) {
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthenticated(true);
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.resendOTP(email);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      // Login returns OTP, not token. Token comes after OTP verification.
      // Just return the response - don't set authentication yet
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Get User Metrics
  const getUserMetrics = async () => {
    try {
      const response = await authAPI.getUserMetrics();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get Dashboard Visualizations
  const getDashboardVisualizations = async () => {
    try {
      const response = await authAPI.getDashboardVisualizations();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    register,
    verifyOTP,
    resendOTP,
    login,
    logout,
    getUserMetrics,
    getDashboardVisualizations,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


