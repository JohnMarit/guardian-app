
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

// In a real implementation, this would be replaced with an actual map library like Leaflet or Google Maps
const AlertMap: React.FC = () => {
  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle>Threat Map</CardTitle>
        <CardDescription>Live view of reported incidents in Twic East County</CardDescription>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="map-container bg-gray-200 rounded-md flex items-center justify-center">
          <div className="text-center p-6">
            <p className="mb-4 text-muted-foreground">Map visualization will be loaded here</p>
            <p className="text-sm text-muted-foreground">
              In production, this would display an interactive map with pins showing reported incidents
            </p>
            
            {/* Example alert markers - in production these would be placed on the map */}
            <div className="flex justify-center gap-4 mt-8">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-alert-high animate-pulse"></div>
                <p className="text-xs mt-1">High Alert</p>
              </div>
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-alert-medium"></div>
                <p className="text-xs mt-1">Medium Alert</p>
              </div>
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-alert-low"></div>
                <p className="text-xs mt-1">Verified Safe</p>
              </div>
            </div>
            
            {/* Example regions */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="border border-dashed border-gray-400 p-4 rounded-md">
                <p className="font-medium">Panyagor Region</p>
                <div className="mt-2 flex justify-center">
                  <div className="w-4 h-4 rounded-full bg-alert-high animate-pulse"></div>
                </div>
              </div>
              <div className="border border-dashed border-gray-400 p-4 rounded-md">
                <p className="font-medium">Poktap Area</p>
                <div className="mt-2 flex justify-center">
                  <div className="w-4 h-4 rounded-full bg-alert-medium"></div>
                </div>
              </div>
              <div className="border border-dashed border-gray-400 p-4 rounded-md">
                <p className="font-medium">Duk Border</p>
                <div className="mt-2 flex justify-center">
                  <div className="w-4 h-4 rounded-full bg-alert-medium animate-pulse"></div>
                </div>
              </div>
              <div className="border border-dashed border-gray-400 p-4 rounded-md">
                <p className="font-medium">Makuach Zone</p>
                <div className="mt-2 flex justify-center">
                  <div className="w-4 h-4 rounded-full bg-alert-low"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertMap;
