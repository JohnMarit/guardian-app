
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ShieldCheck, Users, Satellite, Plane } from 'lucide-react';

const StatsOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Alerts Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-alert-high" />
            <div className="text-2xl font-bold">3</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">2 verified, 1 pending</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Protected Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <div className="text-2xl font-bold">4</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Panyagor, Poktap, Makuach, Duk</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Satellites Active</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Satellite className="h-5 w-5 text-alert-info" />
            <div className="text-2xl font-bold">2</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">NASA FIRMS coverage active</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Aerial Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-alert-medium" />
            <div className="text-2xl font-bold">1</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Currently monitoring Duk border</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
