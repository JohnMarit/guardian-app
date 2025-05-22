import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, MapPin, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface Alert {
  id: string;
  title: string;
  description: string;
  location: string;
  level: 'low' | 'medium' | 'high';
  status: 'pending' | 'verified' | 'dismissed';
  created_at: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface AlertAnalyticsProps {
  alerts: Alert[];
}

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

const DATE_RANGES = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
  { label: 'Custom', value: 'custom' },
];

const AlertAnalytics: React.FC<AlertAnalyticsProps> = ({ alerts }) => {
  const [dateRange, setDateRange] = useState<number | 'custom'>(7);
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Calculate date range
  const { startDate, endDate } = useMemo(() => {
    let end = new Date();
    let start = new Date();
    
    if (dateRange === 'custom') {
      start = customStartDate ? new Date(customStartDate) : new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      end = customEndDate ? new Date(customEndDate) : new Date();
    } else {
      start.setDate(start.getDate() - dateRange);
    }
    
    return { startDate: start, endDate: end };
  }, [dateRange, customStartDate, customEndDate]);

  // Filter alerts by date range
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const alertDate = new Date(alert.created_at);
      return alertDate >= startDate && alertDate <= endDate;
    });
  }, [alerts, startDate, endDate]);

  // Calculate statistics
  const totalAlerts = filteredAlerts.length;
  const pendingAlerts = filteredAlerts.filter(a => a.status === 'pending').length;
  const verifiedAlerts = filteredAlerts.filter(a => a.status === 'verified').length;
  const dismissedAlerts = filteredAlerts.filter(a => a.status === 'dismissed').length;

  const highAlerts = filteredAlerts.filter(a => a.level === 'high').length;
  const mediumAlerts = filteredAlerts.filter(a => a.level === 'medium').length;
  const lowAlerts = filteredAlerts.filter(a => a.level === 'low').length;

  // Calculate trend data
  const trendData = useMemo(() => {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const data = Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
      };
    });

    filteredAlerts.forEach(alert => {
      const alertDate = new Date(alert.created_at).toISOString().split('T')[0];
      const dayData = data.find(d => d.date === alertDate);
      if (dayData) {
        dayData.total++;
        dayData[alert.level]++;
      }
    });

    return data;
  }, [filteredAlerts, startDate, endDate]);

  // Prepare data for level distribution pie chart
  const levelData = [
    { name: 'Low', value: lowAlerts },
    { name: 'Medium', value: mediumAlerts },
    { name: 'High', value: highAlerts },
  ];

  // Prepare data for status distribution bar chart
  const statusData = [
    { name: 'Pending', value: pendingAlerts },
    { name: 'Verified', value: verifiedAlerts },
    { name: 'Dismissed', value: dismissedAlerts },
  ];

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
          <CardDescription>Select the time period for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value === 'custom' ? 'custom' : Number(e.target.value))}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {DATE_RANGES.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            {dateRange === 'custom' && (
              <>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span>to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              {pendingAlerts} pending, {verifiedAlerts} verified
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highAlerts}</div>
            <p className="text-xs text-muted-foreground">
              {((highAlerts / totalAlerts) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Alerts</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedAlerts}</div>
            <p className="text-xs text-muted-foreground">
              {((verifiedAlerts / totalAlerts) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dismissed Alerts</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dismissedAlerts}</div>
            <p className="text-xs text-muted-foreground">
              {((dismissedAlerts / totalAlerts) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Enhanced Time Series Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Trends</CardTitle>
            <CardDescription>Alerts over time by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} name="Total" />
                  <Line type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={2} name="High" />
                  <Line type="monotone" dataKey="medium" stroke="#eab308" strokeWidth={2} name="Medium" />
                  <Line type="monotone" dataKey="low" stroke="#22c55e" strokeWidth={2} name="Low" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Level Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Levels</CardTitle>
            <CardDescription>Distribution by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {levelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Status Distribution Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alert Status Distribution</CardTitle>
            <CardDescription>Status breakdown with trend analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlertAnalytics; 