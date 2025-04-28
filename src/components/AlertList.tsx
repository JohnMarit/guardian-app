
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Bell, ShieldAlert, MapPin } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { AlertItem, AlertLevel } from '../types/alert';

// Sample data
const sampleAlerts: AlertItem[] = [
  {
    id: '1',
    title: 'Armed individuals spotted',
    description: 'Group of 5-7 armed individuals moving towards Panyagor from east',
    location: 'Eastern Panyagor',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    level: AlertLevel.High,
    verified: true
  },
  {
    id: '2',
    title: 'Suspected movement',
    description: 'Unidentified group moving near border area, direction unknown',
    location: 'Duk Border',
    timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
    level: AlertLevel.Medium,
    verified: false
  },
  {
    id: '3',
    title: 'Shots reported',
    description: 'Distant gunshots heard from Murle direction, situation unclear',
    location: 'Poktap Region',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    level: AlertLevel.Medium,
    verified: true
  },
  {
    id: '4',
    title: 'Drone deployed',
    description: 'Verification drone sent to investigate previous report, no threat found',
    location: 'Makuach Zone',
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    level: AlertLevel.Low,
    verified: true
  },
  {
    id: '5',
    title: 'All clear signal',
    description: 'Previous alert ended, area now secure after patrol',
    location: 'Western Twic East',
    timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
    level: AlertLevel.Low,
    verified: true
  }
];

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
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>Latest reported incidents and threats</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {sampleAlerts.map((alert) => (
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
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AlertList;
