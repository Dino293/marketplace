// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { locale } = this.props;
      return (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <h2>
            {locale === 'id' 
              ? 'Oops! Terjadi kesalahan pada aplikasi.' 
              : 'Oops! Something went wrong with the application.'}
          </h2>
          <p>
            {locale === 'id'
              ? 'Silakan reload halaman atau kembali ke beranda.'
              : 'Please reload the page or return to the homepage.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            {locale === 'id' ? 'Muat Ulang' : 'Reload Page'}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
