import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Sample data representing alert locations
const alertLocations = [
  { 
    id: 1, 
    position: [7.9178, 31.7638], // Panyagor approximate coordinates
    title: 'Armed group spotted',
    details: '5-7 armed individuals sighted moving towards village',
    level: 'high',
    timestamp: new Date().toLocaleString()
  },
  { 
    id: 2, 
    position: [7.8678, 31.7238], // Poktap area approximate coordinates
    title: 'Suspicious movement',
    details: 'Unusual activity reported by residents',
    level: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toLocaleString()
  },
  { 
    id: 3, 
    position: [7.9678, 31.8038], // Duk border approximate coordinates
    title: 'Gunshots reported',
    details: 'Multiple gunshots heard from direction of Murle territory',
    level: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toLocaleString()
  },
  { 
    id: 4, 
    position: [7.8878, 31.6838], // Makuach area approximate coordinates
    title: 'Area secured',
    details: 'Local defense forces completed patrol, no threats detected',
    level: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toLocaleString()
  }
];

const AlertMap: React.FC = () => {
  // Center map on Twic East County (approximate coordinates)
  const mapCenter: [number, number] = [7.9178, 31.7638];
  const mapZoom = 10;
  const [mapHeight, setMapHeight] = useState(400);
  
  // Check screen size for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      // Adjust map height based on screen width for better mobile experience
      if (window.innerWidth < 640) { // Small screens
        setMapHeight(300);
      } else if (window.innerWidth < 768) { // Medium screens
        setMapHeight(350);
      } else {
        setMapHeight(400); // Default for larger screens
      }
    };
    
    // Set initial height
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Return appropriate color based on alert level
  const getAlertColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'blue';
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle>Threat Map</CardTitle>
        <CardDescription>Live view of reported incidents in Twic East County</CardDescription>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="map-container">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ 
              height: `${mapHeight}px`, 
              width: '100%', 
              borderRadius: '0.5rem',
              zIndex: 0 // Fix for iOS Safari z-index stacking issues
            }}
            zoomControl={window.innerWidth > 640} // Hide zoom controls on small screens
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Render alert markers */}
            {alertLocations.map((alert) => (
              <CircleMarker 
                key={alert.id}
                center={alert.position as [number, number]}
                radius={alert.level === 'high' ? 12 : alert.level === 'medium' ? 10 : 8}
                pathOptions={{ 
                  fillColor: getAlertColor(alert.level),
                  color: getAlertColor(alert.level),
                  fillOpacity: 0.7
                }}
                className={alert.level === 'high' ? 'animate-pulse' : ''}
              >
                <Popup className="custom-popup">
                  <div className="p-1">
                    <h3 className="font-medium text-base">{alert.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                    <p className="text-sm mt-1">{alert.details}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`w-2 h-2 rounded-full bg-${getAlertColor(alert.level)}-500`}></div>
                      <span className="text-xs font-medium capitalize">{alert.level} alert</span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="p-4 mt-1">
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs font-medium">High Alert</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-xs font-medium">Medium Alert</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs font-medium">Low Alert</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertMap;
