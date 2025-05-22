import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { alertService } from '../services/api';
import { MapPin, Clock, User, AlertTriangle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  description: string;
  location: string;
  level: 'low' | 'medium' | 'high';
  status: 'pending' | 'verified' | 'dismissed';
  created_at: string;
  created_by: {
    name: string;
    email: string;
  };
  verified_by?: {
    name: string;
    email: string;
  };
}

export default function AlertDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchAlert(id);
    }
  }, [id]);

  const fetchAlert = async (alertId: string) => {
    try {
      const data = await alertService.getAlertById(alertId);
      setAlert(data);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to fetch alert details');
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: 'verified' | 'dismissed') => {
    if (!alert) return;
    try {
      await alertService.updateAlert(alert.id, { status: newStatus });
      fetchAlert(alert.id);
    } catch (err: any) {
      setError('Failed to update alert status');
    }
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'dismissed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading alert details...</div>
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500">{error || 'Alert not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>

        {/* Alert Card */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(alert.status)}
                <h3 className="ml-2 text-lg leading-6 font-medium text-gray-900">
                  {alert.title}
                </h3>
              </div>
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getAlertLevelColor(alert.level)}`}>
                {alert.level}
              </span>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{alert.description}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  {alert.location}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  {new Date(alert.created_at).toLocaleString()}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Reported By</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  {alert.created_by.name}
                </dd>
              </div>
              {alert.verified_by && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Verified By</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-400" />
                    {alert.verified_by.name}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Action Buttons */}
          {alert.status === 'pending' && (
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-3">
              <button
                onClick={() => handleStatusChange('verified')}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Verify Alert
              </button>
              <button
                onClick={() => handleStatusChange('dismissed')}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Dismiss Alert
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 