import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserLogged, logout as apiLogout, login as apiLogin, register as apiRegister, updateUserProfile as apiUpdateProfile } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const result = await getUserLogged();
          if (!result.error && result.data) {
            setAuthUser(result.data);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const res = await apiLogin(credentials);
    if (!res.error && res.data) {
      setAuthUser(res.data.user);
    }
    return res;
  };

  const register = async (userData) => {
    return await apiRegister(userData);
  };

  const logout = () => {
    apiLogout();
    setAuthUser(null);
  };

  const updateProfile = async (fields) => {
    const res = await apiUpdateProfile(fields);
    if (!res.error && res.data) {
      setAuthUser(res.data);
    }
    return res;
  };

  const value = {
    authUser,
    setAuthUser,
    initializing,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}