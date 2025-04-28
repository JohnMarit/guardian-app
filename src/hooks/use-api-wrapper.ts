import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useApiContext } from '@/context/ApiContext';
import { ApiError } from '@/lib/api';

/**
 * A wrapper function that adds error handling to API calls
 * @param apiCall Function that makes the API call
 * @returns An async function with error handling
 */
export function useApiCall<T, P = any>(
  apiCall: (params: P) => Promise<T>,
  options?: {
    showErrorToast?: boolean;
    showSuccessToast?: boolean;
    successToastMessage?: string;
  }
) {
  const { toast } = useToast();
  const { setError } = useApiContext();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setLocalError] = useState<Error | null>(null);

  const { 
    showErrorToast = true, 
    showSuccessToast = false,
    successToastMessage = 'Operation completed successfully'
  } = options || {};

  const execute = async (params: P): Promise<T | null> => {
    setIsLoading(true);
    setLocalError(null);
    
    try {
      const result = await apiCall(params);
      setData(result);
      
      if (showSuccessToast) {
        toast({
          title: "Success",
          description: successToastMessage
        });
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unexpected error occurred');
      setLocalError(error);
      
      if (showErrorToast) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
      
      // Update global error state
      setError(error);
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    isLoading,
    data,
    error,
    isError: !!error,
    isSuccess: !!data && !error,
    reset: () => {
      setData(null);
      setLocalError(null);
    }
  };
} 