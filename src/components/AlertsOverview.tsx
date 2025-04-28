import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertOctagon, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { Badge } from './ui/badge';
import { useApiReducer } from '@/hooks/use-api-reducer';
import { api, ApiError } from '@/lib/api';
import { AlertItem, AlertLevel } from '@/types/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ApiErrorAlert from './ApiErrorAlert';

const AlertsOverview: React.FC = () => {
  // Use our reducer-based API hook
  const alertsApi = useApiReducer<AlertItem[]>(api.getAlerts, {
    showSuccessToast: false, // Don't need success toast for initial data load
  });

  // Fetch alerts on component mount and set up auto-refresh
  useEffect(() => {
    fetchAlerts();
    
    // Set up a timer to refresh alerts every 30 seconds
    const refreshTimer = setInterval(() => {
      fetchAlerts();
    }, 30000);
    
    // Clean up the timer when component unmounts
    return () => clearInterval(refreshTimer);
  }, []);

  const fetchAlerts = async () => {
    await alertsApi.execute({});
  };

  // Filter alerts by level
  const highAlerts = alertsApi.data?.filter(alert => alert.level === AlertLevel.High) || [];
  const mediumAlerts = alertsApi.data?.filter(alert => alert.level === AlertLevel.Medium) || [];
  const lowAlerts = alertsApi.data?.filter(alert => alert.level === AlertLevel.Low) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <CardTitle>Alerts Overview</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchAlerts}
            disabled={alertsApi.isLoading}
          >
            {alertsApi.isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardDescription>
          Summary of current security alerts
          <span className="block text-xs mt-1">
            Last updated: {new Date().toLocaleString()}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alertsApi.isError && (
          <ApiErrorAlert 
            error={alertsApi.error as ApiError} 
            onDismiss={alertsApi.reset}
          />
        )}

        {alertsApi.isLoading ? (
          <div className="py-10 flex justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="high" className="text-alert-high">
                High ({highAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="medium" className="text-alert-medium">
                Medium ({mediumAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="low" className="text-alert-low">
                Low ({lowAlerts.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4 space-y-3">
              {alertsApi.data?.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
              
              {(!alertsApi.data || alertsApi.data.length === 0) && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No alerts found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="high" className="mt-4 space-y-3">
              {highAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
              
              {highAlerts.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No high-level alerts</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="medium" className="mt-4 space-y-3">
              {mediumAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
              
              {mediumAlerts.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No medium-level alerts</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="low" className="mt-4 space-y-3">
              {lowAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
              
              {lowAlerts.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No low-level alerts</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {alertsApi.data ? `Total alerts: ${alertsApi.data.length}` : 'No data'}
        </div>
        <Button variant="link" size="sm">View All Alerts</Button>
      </CardFooter>
    </Card>
  );
};

// Helper component to display an alert card
interface AlertCardProps {
  alert: AlertItem;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  // Get alert badge based on alert level
  const getAlertBadge = () => {
    switch (alert.level) {
      case AlertLevel.High:
        return (
          <Badge className="bg-alert-high text-white">
            <AlertOctagon className="h-3 w-3 mr-1" /> High Alert
          </Badge>
        );
      case AlertLevel.Medium:
        return (
          <Badge className="bg-alert-medium text-white">
            <AlertTriangle className="h-3 w-3 mr-1" /> Medium Alert
          </Badge>
        );
      case AlertLevel.Low:
        return (
          <Badge className="bg-alert-low text-white">
            <Check className="h-3 w-3 mr-1" /> Low Alert
          </Badge>
        );
      default:
        return <Badge>Info</Badge>;
    }
  };

  return (
    <div className="border rounded-md p-3 space-y-2">
      <div className="flex justify-between items-start">
        <div className="font-medium">{alert.title}</div>
        {getAlertBadge()}
      </div>
      <p className="text-sm text-muted-foreground">{alert.description}</p>
      <div className="flex justify-between items-center text-xs">
        <span>{alert.location}</span>
        <span>{new Date(alert.timestamp).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default AlertsOverview; 