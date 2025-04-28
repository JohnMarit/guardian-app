import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertOctagon, X } from 'lucide-react';
import { ApiError } from '@/lib/api';

interface ApiErrorAlertProps {
  error: ApiError | Error;
  onDismiss?: () => void;
}

const ApiErrorAlert = ({ error, onDismiss }: ApiErrorAlertProps) => {
  // Extract relevant information from the error
  const isApiError = error instanceof ApiError;
  const status = isApiError ? error.status : 500;
  const code = isApiError ? error.code : 'UNKNOWN_ERROR';
  const message = error.message || 'An unexpected error occurred';

  // Format status code message
  const getStatusMessage = (status: number) => {
    switch (status) {
      case 400: return 'Bad Request';
      case 401: return 'Unauthorized';
      case 403: return 'Forbidden';
      case 404: return 'Not Found';
      case 500: return 'Server Error';
      case 503: return 'Service Unavailable';
      default: return 'Error';
    }
  };

  return (
    <Alert variant="destructive" className="relative mb-4 animate-in slide-in-from-top-4 duration-300">
      <AlertOctagon className="h-4 w-4" />
      <div className="flex justify-between items-start">
        <div>
          <AlertTitle className="flex gap-2 items-center">
            {getStatusMessage(status)}
            {code && <span className="text-xs bg-destructive/20 px-2 py-0.5 rounded-sm">{code}</span>}
          </AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 p-1 hover:bg-destructive/20 rounded-sm transition-colors"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </Alert>
  );
};

export default ApiErrorAlert; 