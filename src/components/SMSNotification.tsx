import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { MessageSquare, Siren, Send, Check, Loader2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { AlertLevel } from '../types/alert';
import { api } from '../lib/api';

interface SMSNotificationProps {
  alertId?: string;
  defaultMessage?: string;
  defaultLevel?: AlertLevel;
}

const SMSNotification: React.FC<SMSNotificationProps> = ({
  alertId,
  defaultMessage,
  defaultLevel = AlertLevel.Medium
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(defaultMessage || '');
  const [alertLevel, setAlertLevel] = useState<AlertLevel>(defaultLevel);
  const [recipients, setRecipients] = useState<number | null>(null);
  
  // Selected regions to send alerts to
  const [selectedRegions, setSelectedRegions] = useState<{[key: string]: boolean}>({
    panyagor: true,
    poktap: false,
    duk: false,
    makuach: false,
    eastern: false,
  });

  const handleRegionChange = (region: string, checked: boolean) => {
    setSelectedRegions(prev => ({
      ...prev,
      [region]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate message
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to send.",
        variant: "destructive"
      });
      return;
    }
    
    // Get selected regions as array
    const regions = Object.entries(selectedRegions)
      .filter(([_, selected]) => selected)
      .map(([region]) => region);
    
    if (regions.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one region to send the alert to.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the API to send SMS alerts
      const result = await api.sendSMSAlert(message, alertLevel, regions);
      
      if (result.success) {
        setRecipients(result.recipients);
        toast({
          title: "Alert Notifications Sent",
          description: `SMS alerts have been broadcast to ${result.recipients} residents in ${regions.length} regions.`,
        });
      } else {
        toast({
          title: "Failed to Send Alerts",
          description: "There was an issue sending the notifications. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending notifications.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAlertTemplate = () => {
    switch (alertLevel) {
      case AlertLevel.High:
        return "URGENT ALERT: Armed individuals reported in [LOCATION]. Seek shelter immediately. Security forces have been notified.";
      case AlertLevel.Medium:
        return "CAUTION: Suspicious activity reported near [LOCATION]. Stay vigilant and report unusual activities.";
      case AlertLevel.Low:
        return "NOTICE: Recent security concerns in [LOCATION] have been addressed. Situation is being monitored.";
      default:
        return "INFORMATION: [Your message here]";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle>SMS Alert Notification</CardTitle>
        </div>
        <CardDescription>Broadcast alerts to registered community members</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {alertId && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm">Sending notifications for Alert #{alertId}</p>
            </div>
          )}
          
          {recipients && (
            <div className="rounded-md bg-muted/50 border p-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <p className="text-sm font-medium">Last alert sent to {recipients} recipients</p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Alert Level</Label>
            <RadioGroup 
              defaultValue={alertLevel} 
              onValueChange={(value) => setAlertLevel(value as AlertLevel)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={AlertLevel.High} id="level-high" />
                <Label htmlFor="level-high" className="text-alert-high font-medium">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={AlertLevel.Medium} id="level-medium" />
                <Label htmlFor="level-medium" className="text-alert-medium font-medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={AlertLevel.Low} id="level-low" />
                <Label htmlFor="level-low" className="text-alert-low font-medium">Low</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="message">Message Template</Label>
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                className="h-auto p-0"
                onClick={() => setMessage(getAlertTemplate())}
              >
                Use Template
              </Button>
            </div>
            <Textarea 
              id="message" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter alert message to send to communities..." 
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Messages will be sent via SMS and WhatsApp to registered community members
            </p>
          </div>

          <div className="space-y-2">
            <Label>Target Regions</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="region-panyagor" 
                  checked={selectedRegions.panyagor}
                  onCheckedChange={(checked) => handleRegionChange('panyagor', checked as boolean)} 
                />
                <Label htmlFor="region-panyagor">Panyagor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="region-poktap" 
                  checked={selectedRegions.poktap}
                  onCheckedChange={(checked) => handleRegionChange('poktap', checked as boolean)} 
                />
                <Label htmlFor="region-poktap">Poktap</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="region-duk" 
                  checked={selectedRegions.duk}
                  onCheckedChange={(checked) => handleRegionChange('duk', checked as boolean)} 
                />
                <Label htmlFor="region-duk">Duk Border</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="region-makuach" 
                  checked={selectedRegions.makuach}
                  onCheckedChange={(checked) => handleRegionChange('makuach', checked as boolean)} 
                />
                <Label htmlFor="region-makuach">Makuach</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="region-eastern" 
                  checked={selectedRegions.eastern}
                  onCheckedChange={(checked) => handleRegionChange('eastern', checked as boolean)} 
                />
                <Label htmlFor="region-eastern">Eastern Corridor</Label>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2">
          <Button 
            type="submit" 
            className={alertLevel === AlertLevel.High ? "bg-alert-high flex-1" : "flex-1"}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                {alertLevel === AlertLevel.High 
                  ? <Siren className="mr-2 h-4 w-4" /> 
                  : <Send className="mr-2 h-4 w-4" />} 
                {alertLevel === AlertLevel.High ? "Send Emergency Alert" : "Send Notification"}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SMSNotification; 