// src/components/ErrorBoundaryWrapper.jsx
import React from 'react';
import { useLocale } from '../contexts/LocaleContext';
import ErrorBoundary from './ErrorBoundary';

export default function ErrorBoundaryWrapper({ children }) {
  const { locale } = useLocale();
  return <ErrorBoundary locale={locale}>{children}</ErrorBoundary>;
}
