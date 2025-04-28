import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { ApiError } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { useApiContext } from '@/context/ApiContext';
import { useState } from 'react';

/**
 * A custom hook that wraps useQuery with error handling for API calls
 */
export function useQueryApi<TData>(
  queryKey: any[],
  queryFn: () => Promise<TData>
): UseQueryResult<TData, Error> & { 
  setGlobalError: (show: boolean) => void;
  showToastOnError: (show: boolean) => void; 
} {
  const { toast } = useToast();
  const { setError } = useApiContext();
  
  const [showGlobalError, setShowGlobalError] = useState(true);
  const [showToast, setShowToast] = useState(true);

  const query = useQuery<TData, Error>({
    queryKey,
    queryFn,
    onError: (error) => {
      // Show toast notification
      if (showToast) {
        toast({
          title: 'Error',
          description: error.message || 'An unexpected error occurred',
          variant: 'destructive'
        });
      }
      
      // Set global error
      if (showGlobalError) {
        setError(error);
      }
    }
  });

  return {
    ...query,
    setGlobalError: setShowGlobalError,
    showToastOnError: setShowToast
  };
}

/**
 * A custom hook that wraps useMutation with error handling for API calls
 */
export function useMutationApi<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void;
    successToastMessage?: string;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    showGlobalError?: boolean;
  }
): UseMutationResult<TData, Error, TVariables> {
  const { toast } = useToast();
  const { setError } = useApiContext();
  const { 
    onSuccess,
    successToastMessage = 'Operation completed successfully',
    showSuccessToast = false,
    showErrorToast = true,
    showGlobalError = true
  } = options || {};

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (data) => {
      if (showSuccessToast) {
        toast({
          title: 'Success',
          description: successToastMessage
        });
      }
      
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      if (showErrorToast) {
        toast({
          title: 'Error',
          description: error.message || 'An unexpected error occurred',
          variant: 'destructive'
        });
      }
      
      if (showGlobalError) {
        setError(error);
      }
    }
  });
} 