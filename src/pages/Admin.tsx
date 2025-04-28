import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertLevel } from '@/types/alert';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Bell, Satellite, Plane, Users, Database, FileText, MessageSquare } from 'lucide-react';
import LawEnforcementDashboard from '@/components/LawEnforcementDashboard';
import DroneVerification from '@/components/DroneVerification';
import SMSNotification from '@/components/SMSNotification';

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container py-6 space-y-6">
        <div>
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage alerts, resources, and surveillance systems
          </p>
        </div>
        
        <Tabs defaultValue="law-enforcement">
          <TabsList>
            <TabsTrigger value="law-enforcement">Law Enforcement</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="systems">Systems</TabsTrigger>
            <TabsTrigger value="alerts">Alert Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="law-enforcement" className="mt-6 space-y-6">
            <LawEnforcementDashboard />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DroneVerification />
              <SMSNotification 
                defaultMessage="ATTENTION: Security forces have been deployed to [LOCATION]. Please remain vigilant and report any suspicious activity."
                defaultLevel={AlertLevel.High}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle>Safety Officers</CardTitle>
                  </div>
                  <CardDescription>Manage community safety personnel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Panyagor Zone</div>
                      <Badge>3 Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Poktap Zone</div>
                      <Badge>2 Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Duk Border Zone</div>
                      <Badge variant="outline">1 Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Makuach Zone</div>
                      <Badge variant="outline">2 Active</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">Add Officer</Button>
                    <Button size="sm" variant="outline" className="flex-1">Send Message</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <CardTitle>Alert Broadcast</CardTitle>
                  </div>
                  <CardDescription>Send alerts to communities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">SMS System</div>
                      <Badge className="bg-alert-low">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">WhatsApp Gateway</div>
                      <Badge className="bg-alert-low">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Radio Alert System</div>
                      <Badge variant="outline" className="text-alert-medium">Offline</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Local Chiefs Network</div>
                      <Badge className="bg-alert-low">Online</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="flex-1 bg-alert-high">Emergency Broadcast</Button>
                    <Button size="sm" variant="outline" className="flex-1">Test System</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle>Historical Data</CardTitle>
                </div>
                <CardDescription>Alert and incident statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">April 2025 Statistics</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-xs text-muted-foreground">Total Alerts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">5</div>
                        <div className="text-xs text-muted-foreground">High Alerts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">4</div>
                        <div className="text-xs text-muted-foreground">Drone Deployments</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">3</div>
                        <div className="text-xs text-muted-foreground">Interventions</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Alert Trends</h3>
                    <div className="h-40 border rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">Chart visualization will appear here</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Export Full Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="systems" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Satellite className="h-5 w-5 text-primary" />
                    <CardTitle>Satellite Monitoring</CardTitle>
                  </div>
                  <CardDescription>NASA FIRMS integration status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">System Status</div>
                      <Badge className="bg-alert-low">Online</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Monitored Areas</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border rounded-md p-2 flex justify-between items-center">
                          <span className="text-sm">Panyagor</span>
                          <span className="w-2 h-2 rounded-full bg-alert-low"></span>
                        </div>
                        <div className="border rounded-md p-2 flex justify-between items-center">
                          <span className="text-sm">Poktap</span>
                          <span className="w-2 h-2 rounded-full bg-alert-low"></span>
                        </div>
                        <div className="border rounded-md p-2 flex justify-between items-center">
                          <span className="text-sm">Duk Border</span>
                          <span className="w-2 h-2 rounded-full bg-alert-low"></span>
                        </div>
                        <div className="border rounded-md p-2 flex justify-between items-center">
                          <span className="text-sm">Eastern Corridor</span>
                          <span className="w-2 h-2 rounded-full bg-alert-medium"></span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">Configure</Button>
                      <Button size="sm">View Data</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-primary" />
                    <CardTitle>Drone Surveillance</CardTitle>
                  </div>
                  <CardDescription>Manage aerial monitoring systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Available Units</div>
                      <Badge className="bg-alert-low">3 Drones</Badge>
                    </div>
                    
                    <div className="border rounded-md divide-y">
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium">Drone Unit 1</div>
                          <div className="text-xs text-muted-foreground">Team Alpha</div>
                        </div>
                        <Badge className="bg-alert-low">Available</Badge>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium">Drone Unit 2</div>
                          <div className="text-xs text-muted-foreground">Team Bravo</div>
                        </div>
                        <Badge variant="outline" className="text-alert-medium">Deployed</Badge>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium">UNMISS Drone</div>
                          <div className="text-xs text-muted-foreground">UN Team</div>
                        </div>
                        <Badge className="bg-alert-low">Available</Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">Maintenance</Button>
                      <Button size="sm">Deploy Drone</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  <CardTitle>AI Threat Detection</CardTitle>
                </div>
                <CardDescription>Automatic filtering and processing of reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="font-medium">SMS Keyword Detection</div>
                      <Badge className="bg-alert-low">Active</Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        Monitors incoming SMS messages for threat-related keywords in local languages
                      </div>
                    </div>
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="font-medium">FIRMS Fire Detection</div>
                      <Badge className="bg-alert-low">Active</Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        Automatically processes NASA FIRMS data to detect potential fires
                      </div>
                    </div>
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="font-medium">Report Verification</div>
                      <Badge className="bg-alert-low">Active</Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        Cross-references multiple reports to verify threats
                      </div>
                    </div>
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="font-medium">Drone Image Analysis</div>
                      <Badge variant="outline" className="text-alert-medium">In Development</Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        Analyzes drone footage to identify armed individuals
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">System Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <CardTitle>Alert Management</CardTitle>
                </div>
                <CardDescription>Review and manage incoming alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">New Alert Review</h3>
                        <p className="text-sm text-muted-foreground">Recent alerts requiring verification</p>
                      </div>
                      <Badge>3 Pending</Badge>
                    </div>
                    
                    <div className="border-t pt-3 space-y-2">
                      <div className="border-l-4 border-alert-high p-3 bg-muted rounded-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Armed individuals near Poktap</span>
                          <span className="text-xs text-muted-foreground">10 min ago</span>
                        </div>
                        <p className="text-sm mt-1">Report of 3-4 armed men moving towards village</p>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button size="sm" variant="outline">Dismiss</Button>
                          <Button size="sm">Verify</Button>
                        </div>
                      </div>
                      
                      <div className="border-l-4 border-alert-medium p-3 bg-muted rounded-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Suspicious activity - Duk Border</span>
                          <span className="text-xs text-muted-foreground">35 min ago</span>
                        </div>
                        <p className="text-sm mt-1">Unusual movement reported by local herders</p>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button size="sm" variant="outline">Dismiss</Button>
                          <Button size="sm">Verify</Button>
                        </div>
                      </div>
                      
                      <div className="border-l-4 border-alert-medium p-3 bg-muted rounded-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Potential fire - Eastern Corridor</span>
                          <span className="text-xs text-muted-foreground">1 hour ago</span>
                        </div>
                        <p className="text-sm mt-1">FIRMS detection of heat signature</p>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button size="sm" variant="outline">Dismiss</Button>
                          <Button size="sm">Verify</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Alert Settings</h3>
                        <p className="text-sm text-muted-foreground">Configure alert thresholds and notifications</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Immediate SMS Alert</span>
                          <Badge variant="outline" className="text-alert-high">High Only</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Auto-Verification</span>
                          <Badge variant="outline" className="text-alert-medium">2+ Reports</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Drone Dispatch</span>
                          <Badge variant="outline" className="text-alert-high">High Only</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Police Notification</span>
                          <Badge variant="outline" className="text-alert-low">All Levels</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button size="sm" variant="outline">Edit Settings</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
