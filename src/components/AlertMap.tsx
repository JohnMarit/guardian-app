import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple } from 'leaflet';

// Custom marker icons
const createCustomIcon = (level: string) => {
  const color = level === 'high' ? '#ef4444' : level === 'medium' ? '#eab308' : '#22c55e';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 100%; height: 100%; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Territory boundaries (example coordinates - replace with actual territory boundaries)
const TERRITORY_BOUNDARIES = [
  {
    name: 'Territory 1',
    coordinates: [
      [0, 0] as LatLngTuple,
      [0, 1] as LatLngTuple,
      [1, 1] as LatLngTuple,
      [1, 0] as LatLngTuple,
    ],
    color: '#3b82f6',
  },
  {
    name: 'Territory 2',
    coordinates: [
      [1, 1] as LatLngTuple,
      [1, 2] as LatLngTuple,
      [2, 2] as LatLngTuple,
      [2, 1] as LatLngTuple,
    ],
    color: '#8b5cf6',
  },
];

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

interface AlertMapProps {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
  showHeatmap?: boolean;
}

const MapController: React.FC<{ alerts: Alert[] }> = ({ alerts }) => {
  const map = useMap();

  useEffect(() => {
    if (alerts.length > 0) {
      const bounds = L.latLngBounds(
        alerts
          .filter(alert => alert.coordinates)
          .map(alert => [alert.coordinates!.lat, alert.coordinates!.lng])
      );
      map.fitBounds(bounds);
    }
  }, [alerts, map]);

  return null;
};

const AlertMap: React.FC<AlertMapProps> = ({ alerts, onAlertClick, showHeatmap = false }) => {
  const mapRef = useRef<L.Map>(null);
  const [mapMode, setMapMode] = useState<'markers' | 'heatmap'>('markers');
  const [showTerritories, setShowTerritories] = useState(true);

  const getHeatmapRadius = (level: string) => {
    switch (level) {
      case 'high':
        return 1000;
      case 'medium':
        return 750;
      case 'low':
        return 500;
      default:
        return 500;
    }
  };

  const getHeatmapColor = (level: string) => {
    switch (level) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#eab308';
      case 'low':
        return '#22c55e';
      default:
        return '#22c55e';
    }
  };

  const isPointInPolygon = (point: L.LatLng, polygon: LatLngTuple[]) => {
    const polygonBounds = L.polygon(polygon).getBounds();
    return polygonBounds.contains(point);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Threat Map</CardTitle>
            <CardDescription>Live view of reported incidents in Twic East County</CardDescription>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTerritories(!showTerritories)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                showTerritories
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showTerritories ? 'Hide Territories' : 'Show Territories'}
            </button>
            <button
              onClick={() => setMapMode('markers')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                mapMode === 'markers'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Markers
            </button>
            <button
              onClick={() => setMapMode('heatmap')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                mapMode === 'heatmap'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Heatmap
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="map-container">
          <MapContainer
            center={[0, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapController alerts={alerts} />
            
            {/* Territory Boundaries */}
            {showTerritories && TERRITORY_BOUNDARIES.map((territory, index) => (
              <Polygon
                key={index}
                positions={territory.coordinates}
                pathOptions={{
                  color: territory.color,
                  fillColor: territory.color,
                  fillOpacity: 0.1,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{territory.name}</h3>
                    <p className="text-sm text-gray-600">
                      {alerts.filter(alert => 
                        alert.coordinates && 
                        isPointInPolygon(
                          L.latLng(alert.coordinates.lat, alert.coordinates.lng),
                          territory.coordinates
                        )
                      ).length} alerts in this territory
                    </p>
                  </div>
                </Popup>
              </Polygon>
            ))}
            
            {mapMode === 'markers' ? (
              <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={(cluster) => {
                  return L.divIcon({
                    html: `<div class="cluster-marker">${cluster.getChildCount()}</div>`,
                    className: 'custom-cluster',
                    iconSize: L.point(40, 40)
                  });
                }}
              >
                {alerts
                  .filter(alert => alert.coordinates)
                  .map(alert => (
                    <Marker
                      key={alert.id}
                      position={[alert.coordinates!.lat, alert.coordinates!.lng]}
                      icon={createCustomIcon(alert.level)}
                      eventHandlers={{
                        click: () => onAlertClick?.(alert),
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold text-lg">{alert.title}</h3>
                          <p className="text-sm text-gray-600">{alert.description}</p>
                          <div className="mt-2 flex items-center">
                            <span
                              className={`inline-block w-3 h-3 rounded-full mr-2 bg-${
                                alert.level === 'high' ? 'red' : alert.level === 'medium' ? 'yellow' : 'green'
                              }-500`}
                            />
                            <span className="text-sm capitalize">{alert.level} priority</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            {new Date(alert.created_at).toLocaleString()}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
              </MarkerClusterGroup>
            ) : (
              // Heatmap using circles
              alerts
                .filter(alert => alert.coordinates)
                .map(alert => (
                  <Circle
                    key={alert.id}
                    center={[alert.coordinates!.lat, alert.coordinates!.lng]}
                    radius={getHeatmapRadius(alert.level)}
                    pathOptions={{
                      fillColor: getHeatmapColor(alert.level),
                      fillOpacity: 0.3,
                      color: getHeatmapColor(alert.level),
                      weight: 1,
                    }}
                    eventHandlers={{
                      click: () => onAlertClick?.(alert),
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg">{alert.title}</h3>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                        <div className="mt-2 flex items-center">
                          <span
                            className={`inline-block w-3 h-3 rounded-full mr-2 bg-${
                              alert.level === 'high' ? 'red' : alert.level === 'medium' ? 'yellow' : 'green'
                            }-500`}
                          />
                          <span className="text-sm capitalize">{alert.level} priority</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {new Date(alert.created_at).toLocaleString()}
                        </div>
                      </div>
                    </Popup>
                  </Circle>
                ))
            )}
          </MapContainer>
        </div>

        <div className="p-4 mt-1">
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs font-medium">High Alert</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
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
