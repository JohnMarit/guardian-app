import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Plane, Loader2, Check, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { AlertLevel } from '../types/alert';
import { api } from '../lib/api';

interface DroneVerificationProps {
  alertId?: string;
  onVerificationComplete?: (verified: boolean, notes: string) => void;
}

const DroneVerification: React.FC<DroneVerificationProps> = ({ 
  alertId,
  onVerificationComplete
}) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<'idle' | 'requesting' | 'deployed' | 'complete'>('idle');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const [droneTeam, setDroneTeam] = useState('unmiss');
  const [estimatedArrival, setEstimatedArrival] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestDrone = async () => {
    if (!alertId) {
      toast({
        title: "Error",
        description: "No alert ID provided. Cannot request drone verification.",
        variant: "destructive"
      });
      return;
    }

    setStatus('requesting');
    setIsLoading(true);
    
    try {
      // Call the API to request drone verification
      const response = await api.requestDroneVerification(alertId, droneTeam);
      
      if (response.success) {
        setStatus('deployed');
        setEstimatedArrival(response.estimatedArrival);
        toast({
          title: "Drone Deployed",
          description: `Drone team dispatched to verify the alert. ETA: ${response.estimatedArrival} minutes.`,
        });
      } else {
        setStatus('idle');
        toast({
          title: "Deployment Failed",
          description: "Unable to deploy drone at this time. Please try again later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setStatus('idle');
      toast({
        title: "Error",
        description: "An error occurred while requesting drone verification.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (verified: boolean) => {
    if (!alertId) return;
    
    setIsLoading(true);
    
    try {
      // Call the API to submit the verification result
      const response = await api.submitVerificationResult(alertId, verified, notes);
      
      if (response.success) {
        setVerificationResult(verified);
        setStatus('complete');
        
        if (onVerificationComplete) {
          onVerificationComplete(verified, notes);
        }
        
        toast({
          title: verified ? "Alert Verified" : "Alert Dismissed",
          description: verified 
            ? "The threat has been confirmed by drone surveillance." 
            : "The alert has been marked as false alarm.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while submitting verification result.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Plane className="h-5 w-5 text-primary" />
          <CardTitle>Drone Verification</CardTitle>
        </div>
        <CardDescription>
          Deploy aerial surveillance to verify reported threats
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'idle' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="drone-team">Drone Team</Label>
              <Select 
                defaultValue={droneTeam} 
                onValueChange={setDroneTeam}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select drone team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unmiss">UNMISS Patrol Team</SelectItem>
                  <SelectItem value="county">County Response Unit</SelectItem>
                  <SelectItem value="police">Police Surveillance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {alertId && (
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm">Requesting verification for Alert #{alertId}</p>
              </div>
            )}
          </div>
        )}
        
        {status === 'requesting' && (
          <div className="py-6 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p>Contacting drone team...</p>
          </div>
        )}
        
        {status === 'deployed' && (
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium">Drone deployed and en route</p>
              <p className="text-xs text-muted-foreground mt-1">
                Estimated time to target: {estimatedArrival} minutes
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verification-notes">Verification Notes</Label>
              <Textarea
                id="verification-notes"
                placeholder="Enter details about what the drone observes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        )}
        
        {status === 'complete' && (
          <div className="py-4 space-y-3">
            <div className={`flex items-center gap-2 p-3 rounded-md ${
              verificationResult 
                ? 'bg-alert-high/20 text-alert-high' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {verificationResult ? (
                <Check className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
              <p className="font-medium">
                {verificationResult ? 'Threat Confirmed' : 'False Alarm'}
              </p>
            </div>
            
            {notes && (
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-medium">Verification Notes</p>
                <p className="text-sm mt-1">{notes}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {status === 'idle' && (
          <Button 
            onClick={handleRequestDrone} 
            disabled={isLoading || !alertId}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Plane className="mr-2 h-4 w-4" /> 
                Request Drone Verification
              </>
            )}
          </Button>
        )}
        
        {status === 'deployed' && (
          <div className="flex gap-2 w-full">
            <Button 
              onClick={() => handleVerificationSubmit(false)}
              variant="outline"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )} 
              Not Verified
            </Button>
            <Button 
              onClick={() => handleVerificationSubmit(true)}
              disabled={isLoading}
              className="flex-1 bg-alert-high"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )} 
              Confirm Threat
            </Button>
          </div>
        )}
        
        {status === 'complete' && (
          <Button 
            onClick={() => setStatus('idle')}
            variant="outline"
            className="w-full"
          >
            New Verification
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DroneVerification; 