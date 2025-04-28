import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Users, MapPin, Clock, AlertTriangle, Check, FileText, Truck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertLevel } from '../types/alert';

const LawEnforcementDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('active');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Law Enforcement Dashboard</CardTitle>
        </div>
        <CardDescription>Coordinate response teams and track patrol priorities</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="border-b px-6">
            <TabsList className="w-full justify-start gap-4 h-12">
              <TabsTrigger value="active" className="relative h-12 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary">
                Active Threats
              </TabsTrigger>
              <TabsTrigger value="patrols" className="relative h-12 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary">
                Patrol Units
              </TabsTrigger>
              <TabsTrigger value="resources" className="relative h-12 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary">
                Resources
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="active" className="p-6 space-y-6">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Priority</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Alert Details</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AlertRow 
                    id="ALE-001"
                    priority="High"
                    location="Eastern Panyagor"
                    details="Armed group of 5-7 individuals, moving westward"
                    status="Verified"
                    assignedTeam="Team Alpha"
                  />
                  <AlertRow 
                    id="ALE-002"
                    priority="Medium"
                    location="Duk Border"
                    details="Suspicious movement, potential armed individuals"
                    status="Unverified"
                    assignedTeam={null}
                  />
                  <AlertRow 
                    id="ALE-003"
                    priority="High"
                    location="Southern Border"
                    details="Fire detected via satellite, potential village burning"
                    status="Responding"
                    assignedTeam="Team Charlie"
                  />
                </TableBody>
              </Table>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Patrol Priorities</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Eastern Corridor</span>
                    <Badge className="bg-alert-high">High</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Panyagor Region</span>
                    <Badge className="bg-alert-medium">Medium</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Duk Border</span>
                    <Badge className="bg-alert-medium">Medium</Badge>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Recent Incidents</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Gunshots reported</span>
                    <span className="text-muted-foreground">2h ago</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Armed group sighting</span>
                    <span className="text-muted-foreground">5h ago</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Fire detection</span>
                    <span className="text-muted-foreground">12h ago</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Available Units</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rapid Response</span>
                    <Badge variant="outline" className="text-alert-low">3 Units</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Local Police</span>
                    <Badge variant="outline" className="text-alert-low">5 Units</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">UNMISS Patrol</span>
                    <Badge variant="outline" className="text-alert-low">2 Units</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="patrols" className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PatrolCard 
                id="PT-001"
                name="Team Alpha"
                status="Active"
                location="Eastern Panyagor"
                members={4}
                lastContact={new Date(Date.now() - 1000 * 60 * 30)}
              />
              <PatrolCard 
                id="PT-002"
                name="Team Bravo"
                status="Standby"
                location="Command Center"
                members={5}
                lastContact={new Date(Date.now() - 1000 * 60 * 5)}
              />
              <PatrolCard 
                id="PT-003"
                name="Team Charlie"
                status="Active"
                location="Southern Border"
                members={6}
                lastContact={new Date(Date.now() - 1000 * 60 * 15)}
              />
              <PatrolCard 
                id="PT-004"
                name="UNMISS Patrol"
                status="Active"
                location="Duk Border"
                members={8}
                lastContact={new Date(Date.now() - 1000 * 60 * 45)}
              />
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Patrol Reports
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResourceCard 
                name="Police Vehicles"
                total={8}
                available={5}
                icon={<Truck className="h-10 w-10 text-primary" />}
              />
              <ResourceCard 
                name="Communication Devices"
                total={24}
                available={18}
                icon={<Shield className="h-10 w-10 text-primary" />}
              />
              <ResourceCard 
                name="Drone Teams"
                total={3}
                available={2}
                icon={<Users className="h-10 w-10 text-primary" />}
              />
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4">Resource Distribution</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md p-3 space-y-2">
                  <div className="font-medium">Panyagor Zone</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Police Units</span>
                      <span>3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Communication</span>
                      <span>8</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Drone Coverage</span>
                      <span>Yes</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-3 space-y-2">
                  <div className="font-medium">Duk Border</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Police Units</span>
                      <span>2</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Communication</span>
                      <span>6</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Drone Coverage</span>
                      <span>Limited</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-3 space-y-2">
                  <div className="font-medium">Eastern Corridor</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Police Units</span>
                      <span>1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Communication</span>
                      <span>4</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Drone Coverage</span>
                      <span>Yes</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-3 space-y-2">
                  <div className="font-medium">Makuach Zone</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Police Units</span>
                      <span>2</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Communication</span>
                      <span>6</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Drone Coverage</span>
                      <span>No</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface AlertRowProps {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  location: string;
  details: string;
  status: 'Verified' | 'Unverified' | 'Responding' | 'Resolved';
  assignedTeam: string | null;
}

const AlertRow: React.FC<AlertRowProps> = ({
  id,
  priority,
  location,
  details,
  status,
  assignedTeam
}) => {
  const getPriorityBadge = () => {
    switch (priority) {
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
  
  const getStatusBadge = () => {
    switch (status) {
      case 'Verified':
        return <Badge variant="outline" className="border-alert-high text-alert-high">Verified</Badge>;
      case 'Unverified':
        return <Badge variant="outline" className="border-alert-medium text-alert-medium">Unverified</Badge>;
      case 'Responding':
        return <Badge variant="outline" className="border-green-500 text-green-500">Responding</Badge>;
      case 'Resolved':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Resolved</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <TableRow>
      <TableCell>{getPriorityBadge()}</TableCell>
      <TableCell>
        <div className="font-medium">{location}</div>
        <div className="text-xs text-muted-foreground">ID: {id}</div>
      </TableCell>
      <TableCell>
        <div className="max-w-md">{details}</div>
        {assignedTeam && (
          <div className="text-xs text-muted-foreground mt-1">
            Assigned to: {assignedTeam}
          </div>
        )}
      </TableCell>
      <TableCell>{getStatusBadge()}</TableCell>
      <TableCell>
        <Button variant="outline" size="sm" className="w-full">
          Details
        </Button>
      </TableCell>
    </TableRow>
  );
};

interface PatrolCardProps {
  id: string;
  name: string;
  status: 'Active' | 'Standby' | 'Off-duty';
  location: string;
  members: number;
  lastContact: Date;
}

const PatrolCard: React.FC<PatrolCardProps> = ({
  id,
  name,
  status,
  location,
  members,
  lastContact
}) => {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  const getStatusBadge = () => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'Standby':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Standby</Badge>;
      case 'Off-duty':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Off-duty</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="border rounded-md p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">ID: {id}</p>
        </div>
        {getStatusBadge()}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{members} team members</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>Last contact: {getTimeAgo(lastContact)}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1">
          Contact
        </Button>
        <Button size="sm" className="flex-1">
          Assign
        </Button>
      </div>
    </div>
  );
};

interface ResourceCardProps {
  name: string;
  total: number;
  available: number;
  icon: React.ReactNode;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  name,
  total,
  available,
  icon
}) => {
  const percentage = Math.floor((available / total) * 100);
  
  return (
    <div className="border rounded-md p-4 flex items-center gap-4">
      <div className="p-2 border rounded-full bg-background">
        {icon}
      </div>
      
      <div className="space-y-1">
        <h3 className="font-medium">{name}</h3>
        
        <div className="flex justify-between items-center text-sm">
          <span>{available} of {total} available</span>
          <Badge variant="outline">{percentage}%</Badge>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LawEnforcementDashboard; 