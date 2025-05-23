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

// Approximate boundaries for Twic East, Duk, Bor (South Sudan)
const COUNTY_BOUNDARIES = [
  {
    name: 'Twic East',
    coordinates: [
      [7.5, 31.2], [7.9, 31.2], [7.9, 31.7], [7.5, 31.7], [7.5, 31.2]
    ],
    color: '#3b82f6',
  },
  {
    name: 'Duk',
    coordinates: [
      [8.0, 31.2], [8.4, 31.2], [8.4, 31.7], [8.0, 31.7], [8.0, 31.2]
    ],
    color: '#8b5cf6',
  },
  {
    name: 'Bor',
    coordinates: [
      [6.9, 31.3], [7.3, 31.3], [7.3, 31.8], [6.9, 31.8], [6.9, 31.3]
    ],
    color: '#22c55e',
  },
];

// Bounding box for all three counties
const BOUNDS = {
  minLat: 6.9,
  maxLat: 8.4,
  minLng: 31.2,
  maxLng: 31.8,
};

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
  const [nasaFires, setNasaFires] = useState<any[]>([]);
  const [mapType, setMapType] = useState<'satellite' | 'standard'>('satellite');

  // Fetch NASA FIRMS fire data (last 24h, global)
  useEffect(() => {
    fetch('https://firms.modaps.eosdis.nasa.gov/geojson/c6/global/24h.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.features) {
          setNasaFires(data.features);
        }
      })
      .catch(err => console.error('Error fetching NASA FIRMS data:', err));
  }, []);

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

  const mapCenter: [number, number] = [7.7, 31.5];
  const mapZoom = 9;

  // Filter NASA FIRMS fires to only those within the bounding box
  const filteredNasaFires = nasaFires.filter(fire => {
    const [lng, lat] = fire.geometry.coordinates;
    return lat >= BOUNDS.minLat && lat <= BOUNDS.maxLat && lng >= BOUNDS.minLng && lng <= BOUNDS.maxLng;
  });

  // Placeholder for mass movement event
  const massMovementMarker = {
    lat: 7.8,
    lng: 31.4,
    description: 'Mass movement detected (placeholder)',
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
            <button
              onClick={() => setMapType(mapType === 'satellite' ? 'standard' : 'satellite')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                mapType === 'satellite'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {mapType === 'satellite' ? 'Satellite' : 'Standard'}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="map-container">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '500px', width: '100%' }}
            ref={mapRef}
          >
            {/* Map tile layer toggle */}
            <>
              {mapType === 'satellite' ? (
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />
              ) : (
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              )}
            </>
            <MapController alerts={alerts} />
            
            {/* Draw county boundaries */}
            {COUNTY_BOUNDARIES.map((county, idx) => (
              <Polygon
                key={county.name}
                positions={county.coordinates.map(([lat, lng]) => [lat, lng] as LatLngTuple)}
                pathOptions={{
                  color: county.color,
                  fillColor: county.color,
                  fillOpacity: 0.08,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{county.name} County</h3>
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
            {/* NASA FIRMS fire markers (filtered) */}
            {filteredNasaFires.map((fire, idx) => (
              <Marker
                key={idx}
                position={[fire.geometry.coordinates[1], fire.geometry.coordinates[0]]}
                icon={L.divIcon({
                  className: 'custom-marker',
                  html: `<div style="background-color: #ef4444; width: 18px; height: 18px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`
                })}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">NASA FIRMS Fire</h3>
                    <p className="text-sm text-gray-600">Brightness: {fire.properties.brightness}</p>
                    <p className="text-sm text-gray-600">Confidence: {fire.properties.confidence}</p>
                    <p className="text-sm text-gray-600">Date: {fire.properties.acq_date} {fire.properties.acq_time}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {/* Mass movement placeholder marker */}
            <Marker
              position={[massMovementMarker.lat, massMovementMarker.lng]}
              icon={L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: #eab308; width: 22px; height: 22px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`
              })}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">Mass Movement</h3>
                  <p className="text-sm text-gray-600">{massMovementMarker.description}</p>
                </div>
              </Popup>
            </Marker>
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
