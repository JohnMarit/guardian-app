import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ApiError } from '@/lib/api';
import ApiErrorAlert from './ApiErrorAlert';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | ApiError | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors in its child component tree
 * and displays a fallback UI instead of crashing the whole application
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error | ApiError): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  }

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Otherwise use the default fallback UI
      return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
          
          {this.state.error && <ApiErrorAlert error={this.state.error} />}
          
          <p className="text-muted-foreground mb-4">
            The application encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
          
          <Button onClick={this.handleReset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" /> 
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 