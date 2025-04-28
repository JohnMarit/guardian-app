import { useState } from 'react';
import { ApiError } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

// Define types for the hook
type ApiFunction<T, P> = (params: P) => Promise<T>;
type ApiState<T> = {
  data: T | null;
  error: ApiError | Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

type UseApiOptions = {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError | Error) => void;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successToastMessage?: string;
};

// Default options
const defaultOptions: UseApiOptions = {
  showErrorToast: true,
  showSuccessToast: false,
};

/**
 * A custom hook to handle API calls with loading, error, and success states
 */
export function useApi<T, P = any>(
  apiFunction: ApiFunction<T, P>,
  options: UseApiOptions = {}
) {
  const mergedOptions = { ...defaultOptions, ...options };
  const { toast } = useToast();
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const execute = async (params: P): Promise<T | null> => {
    // Reset state before new execution
    setState({
      data: null,
      error: null,
      isLoading: true,
      isSuccess: false,
      isError: false,
    });

    try {
      const data = await apiFunction(params);
      
      // Set success state
      setState({
        data,
        error: null,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });
      
      // Call onSuccess callback if provided
      if (mergedOptions.onSuccess) {
        mergedOptions.onSuccess(data);
      }

      // Show success toast if enabled
      if (mergedOptions.showSuccessToast) {
        toast({
          title: "Success",
          description: mergedOptions.successToastMessage || "Operation completed successfully",
        });
      }
      
      return data;
    } catch (error) {
      const apiError = error instanceof ApiError 
        ? error 
        : new ApiError('An unexpected error occurred', 500, 'UNKNOWN_ERROR');
      
      // Set error state
      setState({
        data: null,
        error: apiError,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
      
      // Call onError callback if provided
      if (mergedOptions.onError) {
        mergedOptions.onError(apiError);
      }

      // Show error toast if enabled
      if (mergedOptions.showErrorToast) {
        toast({
          title: "Error",
          description: apiError.message,
          variant: "destructive"
        });
      }
      
      return null;
    }
  };

  // Reset the state
  const reset = () => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  };

  return {
    ...state,
    execute,
    reset,
  };
} 