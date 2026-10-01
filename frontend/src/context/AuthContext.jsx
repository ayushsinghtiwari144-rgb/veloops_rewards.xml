import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  registerApi,
  loginApi,
  getCurrentUserApi,
  logoutApi,
  getStoredToken
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = getStoredToken();
      if (token) {
        const currentUser = await getCurrentUserApi();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const data = await registerApi({ name, email, password });
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutApi();
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
