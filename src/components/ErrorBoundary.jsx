import { Component } from 'react';

/**
 * Error Boundary component to catch JavaScript errors in child components
 * and display a fallback UI instead of crashing the entire app.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to monitoring service in production
    if (import.meta.env.PROD) {
      // TODO: Add Sentry or similar error tracking
      // Sentry.captureException(error, { extra: errorInfo });
    } else {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.icon}>⚠️</div>
            <h2 style={styles.title}>Something went wrong</h2>
            <p style={styles.message}>
              We encountered an unexpected error. Please try again.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre style={styles.errorDetails}>
                {this.state.error.toString()}
              </pre>
            )}
            <button style={styles.button} onClick={this.handleRetry}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    padding: '24px',
  },
  content: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  icon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--brand-black)',
    margin: '0 0 8px 0',
  },
  message: {
    fontSize: '14px',
    color: 'var(--brand-black)',
    opacity: 0.7,
    margin: '0 0 16px 0',
  },
  errorDetails: {
    fontSize: '12px',
    color: '#dc2626',
    background: '#fef2f2',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'left',
    overflow: 'auto',
    maxHeight: '100px',
    marginBottom: '16px',
  },
  button: {
    padding: '10px 24px',
    background: 'var(--brand-blue-default)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default ErrorBoundary;
