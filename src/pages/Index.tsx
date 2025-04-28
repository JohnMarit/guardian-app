import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AlertMap from '@/components/AlertMap';
import AlertList from '@/components/AlertList';
import ReportAlert from '@/components/ReportAlert';
import StatsOverview from '@/components/StatsOverview';
import DroneVerification from '@/components/DroneVerification';
import SMSNotification from '@/components/SMSNotification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SatelliteMonitoring from '@/components/SatelliteMonitoring';
import { Button } from '@/components/ui/button';
import { Shield, Bell, AlertTriangle } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container py-6 space-y-6">
        <div>
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Community Guardian Alert System
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time threat monitoring for Twic East County
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-6">
            <StatsOverview />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <AlertMap />
                <AlertList />
              </div>
              <div>
                <ReportAlert />
              </div>
            </div>
            
            <div className="rounded-md border p-4 bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-alert-medium" />
                <h2 className="font-medium">Emergency Resources</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Contact Police
                </Button>
                <Button variant="outline" className="justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Alert Local Chiefs
                </Button>
                <Button variant="outline" className="justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  UNMISS Hotline
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="monitoring" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SatelliteMonitoring />
              <DroneVerification />
            </div>
            
            <AlertMap />
            <AlertList />
          </TabsContent>
          
          <TabsContent value="reporting" className="mt-6 space-y-6">
            <div className="max-w-xl mx-auto">
              <ReportAlert />
              
              <div className="mt-6 rounded-md border p-4">
                <h3 className="font-medium mb-2">Reporting Guidelines</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">1</span>
                    <span>Provide precise location details when reporting incidents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">2</span>
                    <span>Include details about number of individuals, weapons, and direction of movement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">3</span>
                    <span>Only report verified information - avoid rumors or unconfirmed reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">4</span>
                    <span>If possible, provide contact information for follow-up verification</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SMSNotification />
              
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-2">Community Alert Network</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    The alert network currently covers the following areas with registered community members:
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Panyagor Region</span>
                      <span className="text-sm font-medium">342 residents</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Poktap Area</span>
                      <span className="text-sm font-medium">213 residents</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Duk Border Region</span>
                      <span className="text-sm font-medium">187 residents</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Makuach Zone</span>
                      <span className="text-sm font-medium">276 residents</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Eastern Corridor</span>
                      <span className="text-sm font-medium">104 residents</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-2">Recent Broadcasts</h3>
                  <div className="space-y-3">
                    <div className="border-b pb-2">
                      <div className="text-sm font-medium">Security Alert - Eastern Panyagor</div>
                      <div className="text-xs text-muted-foreground">Sent: April 28, 2025 - 10:45 AM</div>
                      <div className="text-xs mt-1">342 recipients</div>
                    </div>
                    <div className="border-b pb-2">
                      <div className="text-sm font-medium">Caution - Duk Border</div>
                      <div className="text-xs text-muted-foreground">Sent: April 27, 2025 - 04:15 PM</div>
                      <div className="text-xs mt-1">187 recipients</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">All Clear - Makuach Zone</div>
                      <div className="text-xs text-muted-foreground">Sent: April 27, 2025 - 01:30 PM</div>
                      <div className="text-xs mt-1">276 recipients</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
