import React, { useEffect, useState } from 'react';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

// Add Officer interface
interface Officer {
  id: string;
  name: string;
  email: string;
  phone: string;
  zone: string;
  role: string;
}

const OFFICER_ROLE_ID = 'REPLACE_WITH_OFFICER_ROLE_ID'; // TODO: Replace with real officer role UUID

function generateRandomPassword(length = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

const Admin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAddOfficerOpen, setIsAddOfficerOpen] = useState(false);
  const [isSendMessageOpen, setIsSendMessageOpen] = useState(false);
  const [newOfficer, setNewOfficer] = useState({ name: '', email: '', phone: '', zone: '' });
  const [messageData, setMessageData] = useState({ subject: '', content: '', zone: '' });
  const [orgId, setOrgId] = useState<string | null>(null);

  // Fetch org_id on mount
  useEffect(() => {
    async function fetchOrgId() {
      try {
        const response = await apiClient.get('/api/v1/users/me');
        setOrgId(response.data.org_id);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch organization ID', variant: 'destructive' });
      }
    }
    fetchOrgId();
  }, [toast]);

  // Fetch officers from the backend
  const { data: officers, isLoading } = useQuery<Officer[]>({
    queryKey: ['officers'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/users', { params: { role: 'officer' } });
      return response.data.data;
    }
  });

  // Group officers by zone (assuming each officer has a 'zone' field)
  const officersByZone: Record<string, number> = officers ? officers.reduce((acc, officer) => {
    const zone = officer.zone || 'Unknown';
    acc[zone] = (acc[zone] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) : {};

  // Mutation to add a new officer
  const addOfficerMutation = useMutation<Officer, Error, Omit<Officer, 'id'>>({
    mutationFn: async (officerData: Omit<Officer, 'id'>) => {
      if (!orgId) throw new Error('Organization ID not loaded');
      const password = generateRandomPassword();
      const payload = {
        username: officerData.email, // use email as username
        email: officerData.email,
        phone: officerData.phone,
        password,
        org_id: orgId,
        roles: [OFFICER_ROLE_ID],
        name: officerData.name,
        zone: officerData.zone,
      };
      const response = await apiClient.post('/api/v1/users', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officers'] });
      setIsAddOfficerOpen(false);
      setNewOfficer({ name: '', email: '', phone: '', zone: '' });
      toast({ title: 'Officer Added', description: 'The new officer has been added successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message || 'Failed to add officer', variant: 'destructive' });
    }
  });

  // Mutation to send message to officers
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { subject: string; content: string; zone: string }) => {
      const response = await apiClient.post('/api/v1/notifications', {
        type_id: 'message',
        content: `${data.subject}\n\n${data.content}`,
        channel: 'sms',
        roles: ['officer'],
        filters: { zone: data.zone }
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "The message has been sent to all officers in the selected zone.",
      });
      setIsSendMessageOpen(false);
      setMessageData({ subject: '', content: '', zone: '' });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleAddOfficer = (e) => {
    e.preventDefault();
    addOfficerMutation.mutate(newOfficer as Omit<Officer, 'id'>);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessageMutation.mutate({
      subject: messageData.subject,
      content: messageData.content,
      zone: messageData.zone,
    });
  };

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
                  {isLoading ? (
                    <div className="text-sm">Loading officers...</div>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(officersByZone).map(([zone, count]) => (
                        <div key={zone} className="flex justify-between items-center">
                          <div className="text-sm">{zone}</div>
                          <Badge>{count} Active</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 flex gap-2">
                    <Dialog open={isAddOfficerOpen} onOpenChange={setIsAddOfficerOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1">Add Officer</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Officer</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddOfficer} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={newOfficer.name}
                              onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newOfficer.email}
                              onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={newOfficer.phone}
                              onChange={(e) => setNewOfficer({ ...newOfficer, phone: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="zone">Zone</Label>
                            <Input
                              id="zone"
                              value={newOfficer.zone}
                              onChange={(e) => setNewOfficer({ ...newOfficer, zone: e.target.value })}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full">Add Officer</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={isSendMessageOpen} onOpenChange={setIsSendMessageOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1">Send Message</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Message to Officers</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSendMessage} className="space-y-4">
                          <div>
                            <Label htmlFor="zone">Select Zone</Label>
                            <select
                              id="zone"
                              className="w-full rounded-md border border-input bg-background px-3 py-2"
                              value={messageData.zone}
                              onChange={(e) => setMessageData({ ...messageData, zone: e.target.value })}
                              required
                            >
                              <option value="">Select a zone</option>
                              {Object.keys(officersByZone).map((zone) => (
                                <option key={zone} value={zone}>
                                  {zone} ({officersByZone[zone]} officers)
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                              id="subject"
                              value={messageData.subject}
                              onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="content">Message</Label>
                            <Textarea
                              id="content"
                              value={messageData.content}
                              onChange={(e) => setMessageData({ ...messageData, content: e.target.value })}
                              rows={4}
                              required
                            />
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={sendMessageMutation.isPending}
                          >
                            {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
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
                          <span className="text-sm">Makuach</span>
                          <span className="w-2 h-2 rounded-full bg-alert-low"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-primary" />
                    <CardTitle>Drone Fleet</CardTitle>
                  </div>
                  <CardDescription>Manage surveillance drones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Fleet Status</div>
                      <Badge className="bg-alert-low">Operational</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Available Drones</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border rounded-md p-2 flex justify-between items-center">
                          <span className="text-sm">DJI Mavic 3</span>
                          <span className="w-2 h-2 rounded-full bg-alert-low"></span>
                        </div>
                        <div className="border rounded-md p-2 flex justify-between items-center">
                          <span className="text-sm">DJI Phantom 4</span>
                          <span className="w-2 h-2 rounded-full bg-alert-low"></span>
                        </div>
                        <div className="border rounded-md p-2 flex justify-between items-center">
                          <span className="text-sm">DJI Mini 3</span>
                          <span className="w-2 h-2 rounded-full bg-alert-low"></span>
                        </div>
                        <div className="border rounded-md p-2 flex justify-between items-center">
                          <span className="text-sm">DJI Air 2S</span>
                          <span className="w-2 h-2 rounded-full bg-alert-low"></span>
                        </div>
                      </div>
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
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  <CardTitle>Alert Settings</CardTitle>
                </div>
                <CardDescription>Configure alert thresholds and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Alert Thresholds</div>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Notification Channels</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border rounded-md p-2 flex justify-between items-center">
                        <span className="text-sm">SMS</span>
                        <span className="w-2 h-2 rounded-full bg-alert-low"></span>
                      </div>
                      <div className="border rounded-md p-2 flex justify-between items-center">
                        <span className="text-sm">Email</span>
                        <span className="w-2 h-2 rounded-full bg-alert-low"></span>
                      </div>
                      <div className="border rounded-md p-2 flex justify-between items-center">
                        <span className="text-sm">Push</span>
                        <span className="w-2 h-2 rounded-full bg-alert-low"></span>
                      </div>
                      <div className="border rounded-md p-2 flex justify-between items-center">
                        <span className="text-sm">Radio</span>
                        <span className="w-2 h-2 rounded-full bg-alert-low"></span>
                      </div>
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
