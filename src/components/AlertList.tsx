import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Bell, ShieldAlert, MapPin, RefreshCw } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { AlertItem, AlertLevel } from '../types/alert';
import { api } from '@/lib/api';
import { Button } from './ui/button';

const AlertBadge: React.FC<{ level: AlertLevel }> = ({ level }) => {
  switch (level) {
    case AlertLevel.High:
      return (
        <Badge variant="outline" className="alert-high alert-pill alert-pulse">
          <ShieldAlert className="mr-1 h-3 w-3" />
          High Alert
        </Badge>
      );
    case AlertLevel.Medium:
      return (
        <Badge variant="outline" className="alert-medium alert-pill">
          <Bell className="mr-1 h-3 w-3" />
          Medium Alert
        </Badge>
      );
    case AlertLevel.Low:
      return (
        <Badge variant="outline" className="alert-low alert-pill">
          <ShieldAlert className="mr-1 h-3 w-3" />
          Safe/Resolved
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="alert-info alert-pill">
          Info
        </Badge>
      );
  }
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 60) {
    return `${diffMins} min ago`;
  } else {
    const hours = Math.floor(diffMins / 60);
    return `${hours} hr ago`;
  }
};

const AlertList: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Function to fetch alerts
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getAlerts();
      setAlerts(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch alerts on component mount and set up refresh interval
  useEffect(() => {
    fetchAlerts();
    
    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchAlerts();
    }, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            Latest reported incidents and threats
            <span className="block text-xs mt-1">
              Last updated: {lastUpdated.toLocaleString()}
            </span>
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchAlerts}
          disabled={loading}
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {loading && alerts.length === 0 ? (
          <div className="py-10 flex justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{alert.title}</h3>
                    <AlertBadge level={alert.level} />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{formatTimeAgo(alert.timestamp)}</span>
                      {alert.verified && (
                        <Badge variant="outline" className="ml-1 px-1 py-0 h-4 text-[10px]">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {alerts.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No alerts found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertList;
