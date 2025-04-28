
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ShieldAlert, Send } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { AlertLevel } from '../types/alert';

const ReportAlert: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission process
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Alert Submitted",
        description: "Your alert has been sent to local authorities and nearby communities.",
      });
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-alert-high" />
          <CardTitle>Report an Incident</CardTitle>
        </div>
        <CardDescription>Submit information about suspicious activity or threats</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select defaultValue="panyagor">
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="panyagor">Panyagor</SelectItem>
                <SelectItem value="poktap">Poktap</SelectItem>
                <SelectItem value="duk-border">Duk Border</SelectItem>
                <SelectItem value="makuach">Makuach Zone</SelectItem>
                <SelectItem value="eastern-corridor">Eastern Corridor</SelectItem>
                <SelectItem value="other">Other (specify in description)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threat-level">Threat Level</Label>
            <Select defaultValue="medium">
              <SelectTrigger>
                <SelectValue placeholder="Select threat level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High - Armed individuals seen</SelectItem>
                <SelectItem value="medium">Medium - Suspicious activity</SelectItem>
                <SelectItem value="low">Low - Potential concern</SelectItem>
                <SelectItem value="info">Information Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe what you've seen, including number of individuals, direction of movement, weapons observed, etc." 
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Your contact (optional)</Label>
            <Input id="contact" type="text" placeholder="Phone number or WhatsApp" />
            <p className="text-xs text-muted-foreground">
              Providing contact information helps verify reports and get additional details if needed
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Submit Alert
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReportAlert;
