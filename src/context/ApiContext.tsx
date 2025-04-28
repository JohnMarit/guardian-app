import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ApiError } from '@/lib/api';
import ApiErrorAlert from '@/components/ApiErrorAlert';

// Define the context state type
interface ApiContextState {
  error: ApiError | Error | null;
  setError: (error: ApiError | Error | null) => void;
  clearError: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

// Create the context with default values
const ApiContext = createContext<ApiContextState>({
  error: null,
  setError: () => {},
  clearError: () => {},
  isLoading: false,
  setIsLoading: () => {}
});

// Define props for the provider component
interface ApiProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the application to provide centralized API error handling
 */
export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clearError = () => setError(null);

  // Create the context value
  const contextValue: ApiContextState = {
    error,
    setError,
    clearError,
    isLoading,
    setIsLoading,
  };

  return (
    <ApiContext.Provider value={contextValue}>
      {error && <ApiErrorAlert error={error} onDismiss={clearError} />}
      {children}
    </ApiContext.Provider>
  );
};

/**
 * Custom hook to use the API context
 */
export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
}; 