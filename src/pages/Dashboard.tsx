import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { alertService } from '../services/api';
import { websocketService } from '../services/websocket';
import { exportService } from '../services/export';
import { ShieldAlert, Bell, MapPin, AlertTriangle, CheckCircle, XCircle, Filter, ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight, Map, Download, BarChart2, FileText, Table, Code } from 'lucide-react';
import debounce from 'lodash/debounce';
import AlertMap from '../components/AlertMap';
import AlertAnalytics from '../components/AlertAnalytics';

interface Alert {
  id: string;
  title: string;
  description: string;
  location: string;
  level: 'low' | 'medium' | 'high';
  status: 'pending' | 'verified' | 'dismissed';
  created_at: string;
}

type SortField = 'created_at' | 'level' | 'status';
type SortOrder = 'asc' | 'desc';

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

type ViewType = 'list' | 'map' | 'analytics';

export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    level: 'all',
    search: '',
  });
  const [sort, setSort] = useState<{ field: SortField; order: SortOrder }>({
    field: 'created_at',
    order: 'desc',
  });
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [view, setView] = useState<ViewType>('list');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const navigate = useNavigate();

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters(prev => ({ ...prev, search: value }));
      setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page on search
    }, 300),
    []
  );

  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  const handleFilterChange = (type: 'status' | 'level', value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page on filter change
  };

  const handleSort = (field: SortField) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const filteredAndSortedAlerts = alerts
    .filter(alert => {
      if (filters.status !== 'all' && alert.status !== filters.status) return false;
      if (filters.level !== 'all' && alert.level !== filters.level) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          alert.title.toLowerCase().includes(searchLower) ||
          alert.description.toLowerCase().includes(searchLower) ||
          alert.location.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const multiplier = sort.order === 'asc' ? 1 : -1;
      switch (sort.field) {
        case 'created_at':
          return multiplier * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        case 'level':
          const levelOrder = { high: 3, medium: 2, low: 1 };
          return multiplier * (levelOrder[a.level] - levelOrder[b.level]);
        case 'status':
          return multiplier * a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedAlerts.length / pagination.itemsPerPage);
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const paginatedAlerts = filteredAndSortedAlerts.slice(startIndex, startIndex + pagination.itemsPerPage);

  useEffect(() => {
    fetchAlerts();
    websocketService.connect();

    const unsubscribe = websocketService.subscribe((data) => {
      if (data.type === 'alert_created' || data.type === 'alert_updated' || data.type === 'alert_deleted') {
        fetchAlerts();
      }
    });

    return () => {
      unsubscribe();
      websocketService.disconnect();
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await alertService.getAlerts();
      setAlerts(data);
    } catch (err: any) {
      console.error('Error in fetchAlerts:', err);
      setError(err.message || 'Failed to fetch alerts. Please try again later.');
      setAlerts([]);
    } finally {
      setLoading(false);
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

  const handleExport = (format: 'csv' | 'excel' | 'json') => {
    switch (format) {
      case 'csv':
        exportService.exportToCSV(filteredAndSortedAlerts);
        break;
      case 'excel':
        exportService.exportToExcel(filteredAndSortedAlerts);
        break;
      case 'json':
        exportService.exportToJSON(filteredAndSortedAlerts);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Community Guardian Dashboard
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <div className="relative inline-block text-left">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Download className="h-5 w-5 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {showExportMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => {
                        handleExport('excel');
                        setShowExportMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <Table className="h-4 w-4 mr-3" />
                      Export to Excel
                    </button>
                    <button
                      onClick={() => {
                        handleExport('csv');
                        setShowExportMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <FileText className="h-4 w-4 mr-3" />
                      Export to CSV
                    </button>
                    <button
                      onClick={() => {
                        handleExport('json');
                        setShowExportMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <Code className="h-4 w-4 mr-3" />
                      Export to JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setView('analytics')}
              className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                view === 'analytics'
                  ? 'bg-indigo-600 text-white border-transparent'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setView(view === 'list' ? 'map' : 'list')}
              className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                view === 'map'
                  ? 'bg-indigo-600 text-white border-transparent'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <Map className="h-5 w-5 mr-2" />
              {view === 'list' ? 'Map View' : 'List View'}
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Bell className="h-5 w-5 mr-2" />
              Create New Alert
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShieldAlert className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Alerts</dt>
                    <dd className="text-lg font-medium text-gray-900">{alerts.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Alerts</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {alerts.filter(a => a.status === 'pending').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Verified Alerts</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {alerts.filter(a => a.status === 'verified').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {view === 'analytics' ? (
          <AlertAnalytics alerts={alerts} />
        ) : view === 'map' ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <AlertMap
              alerts={filteredAndSortedAlerts}
              onAlertClick={(alert) => navigate(`/alerts/${alert.id}`)}
            />
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </h3>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                    Search
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="search"
                      name="search"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search alerts..."
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                    Alert Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={filters.level}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                  >
                    <option value="all">All Levels</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Alerts List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Alerts</h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleSort('created_at')}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      Date
                      {sort.field === 'created_at' && (
                        sort.order === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('level')}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      Level
                      {sort.field === 'level' && (
                        sort.order === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('status')}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      Status
                      {sort.field === 'status' && (
                        sort.order === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <ul className="divide-y divide-gray-200">
                {loading ? (
                  <li className="px-6 py-4 text-center text-gray-500">Loading alerts...</li>
                ) : error ? (
                  <li className="px-6 py-4 text-center text-red-500">{error}</li>
                ) : paginatedAlerts.length === 0 ? (
                  <li className="px-6 py-4 text-center text-gray-500">No alerts found</li>
                ) : (
                  paginatedAlerts.map((alert) => (
                    <li key={alert.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/alerts/${alert.id}`)}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getStatusIcon(alert.status)}
                            <p className="ml-2 text-sm font-medium text-gray-900">{alert.title}</p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getAlertLevelColor(alert.level)}`}>
                              {alert.level}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {alert.location}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              Created {new Date(alert.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {alert.description}
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Pagination */}
            {!loading && !error && filteredAndSortedAlerts.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(startIndex + pagination.itemsPerPage, filteredAndSortedAlerts.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredAndSortedAlerts.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.currentPage
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 