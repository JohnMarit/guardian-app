
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertLevel } from '@/types/alert';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Bell, ShieldCheck, FileText, Search, CalendarCheck } from 'lucide-react';

const Reports = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container py-6 space-y-6">
        <div>
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Reports Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            View and analyze historical alert data and incident reports
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search reports..." className="pl-8" />
          </div>
          <Button className="gap-2">
            <CalendarCheck className="h-4 w-4" />
            Filter by date
          </Button>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="high">High Alert</TabsTrigger>
            <TabsTrigger value="medium">Medium Alert</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              <ReportItem 
                id="001"
                title="Armed group spotted near Panyagor"
                description="A group of 5-7 armed individuals sighted moving towards Panyagor from eastern border area. Local police notified and drone surveillance deployed."
                date="April 28, 2025 - 10:45 AM"
                location="Eastern Panyagor"
                level={AlertLevel.High}
                verified={true}
              />
              
              <ReportItem 
                id="002"
                title="Suspicious movement near Duk border"
                description="Unidentified movement reported by residents near the Duk border crossing. Details unclear, patrol requested."
                date="April 28, 2025 - 09:22 AM"
                location="Duk Border Area"
                level={AlertLevel.Medium}
                verified={false}
              />
              
              <ReportItem 
                id="003"
                title="Gunshots reported in Poktap region"
                description="Multiple gunshots heard from direction of Murle territory. Unknown if related to hunting or potential raid activity."
                date="April 27, 2025 - 04:15 PM"
                location="Poktap Region"
                level={AlertLevel.Medium}
                verified={true}
              />
              
              <ReportItem 
                id="004"
                title="All clear following patrol"
                description="Area secured following patrol by local defense forces. Previous suspicious activity determined to be non-threatening."
                date="April 27, 2025 - 01:30 PM"
                location="Makuach Zone"
                level={AlertLevel.Low}
                verified={true}
              />
              
              <ReportItem 
                id="005"
                title="Fire spotted via satellite"
                description="NASA FIRMS detected heat signatures consistent with fire activity. Could indicate village burning or natural brush fire."
                date="April 26, 2025 - 11:50 AM"
                location="Southern Border"
                level={AlertLevel.High}
                verified={true}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="high" className="mt-6">
            <div className="space-y-4">
              <ReportItem 
                id="001"
                title="Armed group spotted near Panyagor"
                description="A group of 5-7 armed individuals sighted moving towards Panyagor from eastern border area. Local police notified and drone surveillance deployed."
                date="April 28, 2025 - 10:45 AM"
                location="Eastern Panyagor"
                level={AlertLevel.High}
                verified={true}
              />
              
              <ReportItem 
                id="005"
                title="Fire spotted via satellite"
                description="NASA FIRMS detected heat signatures consistent with fire activity. Could indicate village burning or natural brush fire."
                date="April 26, 2025 - 11:50 AM"
                location="Southern Border"
                level={AlertLevel.High}
                verified={true}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="medium" className="mt-6">
            <div className="space-y-4">
              <ReportItem 
                id="002"
                title="Suspicious movement near Duk border"
                description="Unidentified movement reported by residents near the Duk border crossing. Details unclear, patrol requested."
                date="April 28, 2025 - 09:22 AM"
                location="Duk Border Area"
                level={AlertLevel.Medium}
                verified={false}
              />
              
              <ReportItem 
                id="003"
                title="Gunshots reported in Poktap region"
                description="Multiple gunshots heard from direction of Murle territory. Unknown if related to hunting or potential raid activity."
                date="April 27, 2025 - 04:15 PM"
                location="Poktap Region"
                level={AlertLevel.Medium}
                verified={true}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="verified" className="mt-6">
            <div className="space-y-4">
              <ReportItem 
                id="001"
                title="Armed group spotted near Panyagor"
                description="A group of 5-7 armed individuals sighted moving towards Panyagor from eastern border area. Local police notified and drone surveillance deployed."
                date="April 28, 2025 - 10:45 AM"
                location="Eastern Panyagor"
                level={AlertLevel.High}
                verified={true}
              />
              
              <ReportItem 
                id="003"
                title="Gunshots reported in Poktap region"
                description="Multiple gunshots heard from direction of Murle territory. Unknown if related to hunting or potential raid activity."
                date="April 27, 2025 - 04:15 PM"
                location="Poktap Region"
                level={AlertLevel.Medium}
                verified={true}
              />
              
              <ReportItem 
                id="004"
                title="All clear following patrol"
                description="Area secured following patrol by local defense forces. Previous suspicious activity determined to be non-threatening."
                date="April 27, 2025 - 01:30 PM"
                location="Makuach Zone"
                level={AlertLevel.Low}
                verified={true}
              />
              
              <ReportItem 
                id="005"
                title="Fire spotted via satellite"
                description="NASA FIRMS detected heat signatures consistent with fire activity. Could indicate village burning or natural brush fire."
                date="April 26, 2025 - 11:50 AM"
                location="Southern Border"
                level={AlertLevel.High}
                verified={true}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface ReportItemProps {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  level: AlertLevel;
  verified: boolean;
}

const ReportItem: React.FC<ReportItemProps> = ({
  id,
  title,
  description,
  date,
  location,
  level,
  verified
}) => {
  const getBadge = () => {
    switch (level) {
      case AlertLevel.High:
        return (
          <Badge variant="outline" className="alert-high alert-pill">
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
            <ShieldCheck className="mr-1 h-3 w-3" />
            Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{date} | {location}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getBadge()}
            {verified && (
              <Badge variant="outline" className="bg-background">Verified</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex justify-between">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Report ID: {id}
          </div>
          <Button size="sm" variant="outline">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reports;
