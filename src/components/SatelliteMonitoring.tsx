import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Satellite, Flame, AlertTriangle, CircleAlert, RefreshCw, MapPin } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { api, HeatSignature } from '../lib/api';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useApiCall } from '@/hooks/use-api-wrapper';
import { useApiContext } from '@/context/ApiContext';

const SatelliteMonitoring: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Use our custom API call hook
  const heatSignaturesApi = useApiCall(api.getHeatSignatures, {
    successToastMessage: "Latest NASA FIRMS fire detection data has been received.",
    showSuccessToast: false, // Don't show every time on auto-refresh
  });
  
  // Center map on Twic East County (approximate coordinates)
  const mapCenter: [number, number] = [7.9178, 31.7638];
  const mapZoom = 10;

  // Load initial data and set up auto-refresh
  useEffect(() => {
    fetchHeatSignatures();
    
    // Set up auto-refresh every 60 seconds
    const refreshInterval = setInterval(() => {
      fetchHeatSignatures(false); // Don't show toast on auto-refresh
    }, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);
  
  const fetchHeatSignatures = async (showToast = true) => {
    // If showing toast, update the API options
    if (showToast !== heatSignaturesApi.showSuccessToast) {
      // This is a workaround since we can't directly modify the API options
      heatSignaturesApi.showSuccessToast = showToast;
    }
    
    const data = await heatSignaturesApi.execute({});
    if (data) {
      setLastUpdated(new Date());
    }
  };

  // Get marker color based on confidence level
  const getMarkerColor = (confidence: string, isActive: boolean) => {
    if (!isActive) return "#888888";
    
    switch (confidence) {
      case 'High':
        return "#EF4444"; // red-500
      case 'Medium':
        return "#F97316"; // orange-500
      case 'Low':
        return "#EAB308"; // yellow-500
      default:
        return "#888888";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
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
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchHeatSignatures(true)}
            disabled={heatSignaturesApi.isLoading}
          >
            {heatSignaturesApi.isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="map">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">Detection List</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="space-y-4">
            <div className="h-60 border rounded-md overflow-hidden">
              {heatSignaturesApi.isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <MapContainer 
                  center={mapCenter} 
                  zoom={mapZoom} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {heatSignaturesApi.data?.map((signature) => (
                    <CircleMarker 
                      key={signature.id}
                      center={signature.coordinates}
                      radius={signature.confidence === 'High' ? 10 : 8}
                      pathOptions={{ 
                        fillColor: getMarkerColor(signature.confidence, signature.isActive),
                        color: getMarkerColor(signature.confidence, signature.isActive),
                        fillOpacity: 0.7,
                        weight: 1
                      }}
                      className={signature.isActive && signature.confidence === 'High' ? 'animate-pulse' : ''}
                    >
                      <Popup>
                        <div className="p-1">
                          <h3 className="font-medium text-base">{signature.location}</h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(signature.timestamp).toLocaleString()}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 rounded-full" style={{ 
                              backgroundColor: getMarkerColor(signature.confidence, signature.isActive)
                            }}></div>
                            <span className="text-xs font-medium">
                              {signature.confidence} confidence
                            </span>
                          </div>
                          {signature.isActive && (
                            <p className="text-xs mt-1 text-red-500 flex items-center gap-1">
                              <CircleAlert className="h-3 w-3" />
                              Active heat signature
                            </p>
                          )}
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              )}
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
            {heatSignaturesApi.isLoading ? (
              <div className="py-10 flex justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              heatSignaturesApi.data?.map((signature) => (
                <DetectionItem 
                  key={signature.id}
                  id={signature.id}
                  location={signature.location}
                  confidence={signature.confidence}
                  timestamp={signature.timestamp}
                  isActive={signature.isActive}
                />
              ))
            )}
            
            {!heatSignaturesApi.isLoading && (!heatSignaturesApi.data || heatSignaturesApi.data.length === 0) && (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No heat signatures detected</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          onClick={() => fetchHeatSignatures(true)} 
          variant="outline" 
          className="w-full"
          disabled={heatSignaturesApi.isLoading}
        >
          {heatSignaturesApi.isLoading ? (
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