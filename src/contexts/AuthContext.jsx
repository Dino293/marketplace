import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserLogged } from '../utils/api';

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
          if (!result.error) {
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

  const value = {
    authUser,
    setAuthUser,
    initializing
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