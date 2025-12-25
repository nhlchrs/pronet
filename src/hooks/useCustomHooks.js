import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook for handling authentication flow (Register -> Verify OTP -> Login)
 */
export const useAuthFlow = () => {
  const { register, verifyOTP, resendOTP, login } = useAuth();
  const [step, setStep] = useState('login'); // login, register, verify
  const [email, setEmail] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleRegister = async (firstName, lastName, email, phone, password) => {
    try {
      const response = await register(firstName, lastName, email, phone, password);
      setEmail(email);
      setStep('verify');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      const response = await verifyOTP(email, otp);
      setStep('success');
      return response;
    } catch (error) {
      setOtpError(error.message);
      throw error;
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await resendOTP(email);
      setOtpError('');
      return response;
    } catch (error) {
      setOtpError(error.message);
      throw error;
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await login(email, password);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    step,
    setStep,
    email,
    otpError,
    handleRegister,
    handleVerifyOTP,
    handleResendOTP,
    handleLogin,
  };
};

/**
 * Hook for async operations with loading and error states
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState(immediate ? 'pending' : 'idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = async (...params) => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      const response = await asyncFunction(...params);
      setStatus('success');
      setData(response);
      return response;
    } catch (error) {
      setStatus('error');
      setError(error);
      throw error;
    }
  };

  return { execute, status, data, error };
};

/**
 * Hook for form handling
 */
export const useForm = (initialState, onSubmit) => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSubmit(formData);
      setSuccess(true);
      setFormData(initialState);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialState);
    setError(null);
    setSuccess(false);
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    resetForm,
    loading,
    error,
    success,
  };
};

/**
 * Hook for pagination
 */
export const usePagination = (items, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    itemsPerPage,
  };
};

/**
 * Hook for localStorage
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Hook for API data fetching
 */
export const useFetch = (url, method = 'GET', options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const config = {
        method,
        headers,
      };

      if (options.body) {
        config.body = JSON.stringify(options.body);
      }

      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchData };
};
