import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Satellite, Flame, AlertTriangle, CircleAlert, RefreshCw } from 'lucide-react';
import { Badge } from './ui/badge';
import { useToast } from './ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const SatelliteMonitoring: React.FC = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API call to NASA FIRMS
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
      toast({
        title: "Satellite Data Updated",
        description: "Latest NASA FIRMS fire detection data has been received.",
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Satellite className="h-5 w-5 text-primary" />
          <CardTitle>Satellite Monitoring</CardTitle>
        </div>
        <CardDescription>
          Fire detection using NASA FIRMS satellite data
          <span className="block text-xs mt-1">
            Last updated: {lastUpdated.toLocaleString()}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="map">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">Detection List</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="space-y-4">
            <div className="border rounded-md p-4 h-60 flex items-center justify-center bg-muted/30">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Satellite imagery will be displayed here</p>
                <p className="text-xs text-muted-foreground">
                  In production, this would show a map with heat signatures
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="border rounded-md p-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Active Fire</span>
              </div>
              <div className="border rounded-md p-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                <span className="text-sm">24hr Detection</span>
              </div>
              <div className="border rounded-md p-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-sm">48hr Detection</span>
              </div>
              <div className="border rounded-md p-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-sm">Past Detection</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="space-y-3">
            <DetectionItem 
              id="FIRMS-1"
              location="Eastern Corridor"
              confidence="High"
              timestamp={new Date(Date.now() - 1000 * 60 * 30)}
              isActive={true}
            />
            <DetectionItem 
              id="FIRMS-2"
              location="Duk Border"
              confidence="Medium"
              timestamp={new Date(Date.now() - 1000 * 60 * 120)}
              isActive={true}
            />
            <DetectionItem 
              id="FIRMS-3"
              location="Southern Poktap"
              confidence="Low"
              timestamp={new Date(Date.now() - 1000 * 60 * 60 * 24)}
              isActive={false}
            />
            <DetectionItem 
              id="FIRMS-4"
              location="Murle Border"
              confidence="High"
              timestamp={new Date(Date.now() - 1000 * 60 * 60 * 36)}
              isActive={false}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="w-full"
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 
              Updating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" /> 
              Refresh Satellite Data
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

interface DetectionItemProps {
  id: string;
  location: string;
  confidence: 'High' | 'Medium' | 'Low';
  timestamp: Date;
  isActive: boolean;
}

const DetectionItem: React.FC<DetectionItemProps> = ({
  id,
  location,
  confidence,
  timestamp,
  isActive
}) => {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  const getConfidenceBadge = () => {
    switch (confidence) {
      case 'High':
        return <Badge className="bg-alert-high">High</Badge>;
      case 'Medium':
        return <Badge className="bg-alert-medium">Medium</Badge>;
      case 'Low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="border rounded-md p-3 space-y-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {isActive ? (
            <Flame className="h-4 w-4 text-alert-high" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-alert-medium" />
          )}
          <span className="font-medium">{location}</span>
        </div>
        {getConfidenceBadge()}
      </div>
      
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>ID: {id}</span>
        <span>{getTimeAgo(timestamp)}</span>
      </div>
      
      {isActive && (
        <div className="flex items-center gap-1 text-xs text-alert-high">
          <CircleAlert className="h-3 w-3" />
          <span>Active heat signature detected</span>
        </div>
      )}
    </div>
  );
};

export default SatelliteMonitoring; 