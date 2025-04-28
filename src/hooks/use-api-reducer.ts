import { useReducer, useCallback } from 'react';
import { ApiError } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

// Action types
export enum ApiActionType {
  API_REQUEST = 'API_REQUEST',
  API_SUCCESS = 'API_SUCCESS',
  API_FAILURE = 'API_FAILURE',
  API_RESET = 'API_RESET'
}

// Action interfaces
interface ApiRequestAction {
  type: ApiActionType.API_REQUEST;
}

interface ApiSuccessAction<T> {
  type: ApiActionType.API_SUCCESS;
  payload: T;
}

interface ApiFailureAction {
  type: ApiActionType.API_FAILURE;
  error: ApiError | Error;
}

interface ApiResetAction {
  type: ApiActionType.API_RESET;
}

// Union of all possible actions
type ApiAction<T> = 
  | ApiRequestAction
  | ApiSuccessAction<T>
  | ApiFailureAction
  | ApiResetAction;

// State interface
export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | Error | null;
  isSuccess: boolean;
  isError: boolean;
}

// Initial state
const initialState = <T>(): ApiState<T> => ({
  data: null,
  isLoading: false,
  error: null,
  isSuccess: false,
  isError: false
});

// Reducer function
function apiReducer<T>(state: ApiState<T>, action: ApiAction<T>): ApiState<T> {
  switch (action.type) {
    case ApiActionType.API_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
        isSuccess: false,
        isError: false
      };
    case ApiActionType.API_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        isSuccess: true,
        isError: false
      };
    case ApiActionType.API_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        isSuccess: false,
        isError: true
      };
    case ApiActionType.API_RESET:
      return initialState<T>();
    default:
      return state;
  }
}

// Hook options interface
interface UseApiReducerOptions {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successToastMessage?: string;
}

// Default options
const defaultOptions: UseApiReducerOptions = {
  showErrorToast: true,
  showSuccessToast: false
};

/**
 * Custom hook that combines useReducer with API calls for more complex state management
 */
export function useApiReducer<T, P = any>(
  apiFunction: (params: P) => Promise<T>,
  options: UseApiReducerOptions = {}
) {
  const mergedOptions = { ...defaultOptions, ...options };
  const [state, dispatch] = useReducer(apiReducer<T>, initialState<T>());
  const { toast } = useToast();

  const execute = useCallback(
    async (params: P): Promise<T | null> => {
      dispatch({ type: ApiActionType.API_REQUEST });

      try {
        const data = await apiFunction(params);
        dispatch({ type: ApiActionType.API_SUCCESS, payload: data });

        // Show success toast if enabled
        if (mergedOptions.showSuccessToast) {
          toast({
            title: 'Success',
            description: mergedOptions.successToastMessage || 'Operation completed successfully'
          });
        }

        return data;
      } catch (error) {
        const apiError = error instanceof ApiError
          ? error
          : new ApiError('An unexpected error occurred', 500, 'UNKNOWN_ERROR');

        dispatch({ type: ApiActionType.API_FAILURE, error: apiError });

        // Show error toast if enabled
        if (mergedOptions.showErrorToast) {
          toast({
            title: 'Error',
            description: apiError.message,
            variant: 'destructive'
          });
        }

        return null;
      }
    },
    [apiFunction, toast, mergedOptions]
  );

  const reset = useCallback(() => {
    dispatch({ type: ApiActionType.API_RESET });
  }, []);

  return {
    ...state,
    execute,
    reset,
    dispatch
  };
} 