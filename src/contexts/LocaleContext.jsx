import React, { createContext, useState, useContext } from 'react';

const LocaleContext = createContext();

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('id');

  const toggleLocale = () => {
    setLocale(prev => prev === 'id' ? 'en' : 'id');
  };

  const value = {
    locale,
    setLocale,
    toggleLocale
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}