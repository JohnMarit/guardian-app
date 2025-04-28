import { AlertItem, AlertLevel } from '../types/alert';

// Custom API error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Mock alert data
const mockAlerts: AlertItem[] = [
  {
    id: '001',
    title: 'Armed group spotted near Panyagor',
    description: 'A group of 5-7 armed individuals sighted moving towards Panyagor from eastern border area. Local police notified and drone surveillance deployed.',
    location: 'Eastern Panyagor',
    timestamp: new Date(2025, 3, 28, 10, 45),
    level: AlertLevel.High,
    verified: true
  },
  {
    id: '002',
    title: 'Suspicious movement near Duk border',
    description: 'Unidentified movement reported by residents near the Duk border crossing. Details unclear, patrol requested.',
    location: 'Duk Border Area',
    timestamp: new Date(2025, 3, 28, 9, 22),
    level: AlertLevel.Medium,
    verified: false
  },
  {
    id: '003',
    title: 'Gunshots reported in Poktap region',
    description: 'Multiple gunshots heard from direction of Murle territory. Unknown if related to hunting or potential raid activity.',
    location: 'Poktap Region',
    timestamp: new Date(2025, 3, 27, 16, 15),
    level: AlertLevel.Medium,
    verified: true
  },
  {
    id: '004',
    title: 'All clear following patrol',
    description: 'Area secured following patrol by local defense forces. Previous suspicious activity determined to be non-threatening.',
    location: 'Makuach Zone',
    timestamp: new Date(2025, 3, 27, 13, 30),
    level: AlertLevel.Low,
    verified: true
  },
  {
    id: '005',
    title: 'Fire spotted via satellite',
    description: 'NASA FIRMS detected heat signatures consistent with fire activity. Could indicate village burning or natural brush fire.',
    location: 'Southern Border',
    timestamp: new Date(2025, 3, 26, 11, 50),
    level: AlertLevel.High,
    verified: true
  }
];

// Mock heat signatures from NASA FIRMS
export interface HeatSignature {
  id: string;
  location: string;
  coordinates: [number, number];
  timestamp: Date;
  confidence: 'High' | 'Medium' | 'Low';
  isActive: boolean;
}

const mockHeatSignatures: HeatSignature[] = [
  {
    id: 'FIRMS-1',
    location: 'Eastern Corridor',
    coordinates: [7.9578, 31.8238],
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    confidence: 'High',
    isActive: true
  },
  {
    id: 'FIRMS-2',
    location: 'Duk Border',
    coordinates: [7.9878, 31.8638],
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    confidence: 'Medium',
    isActive: true
  },
  {
    id: 'FIRMS-3',
    location: 'Southern Poktap',
    coordinates: [7.8378, 31.7038],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    confidence: 'Low',
    isActive: false
  },
  {
    id: 'FIRMS-4',
    location: 'Murle Border',
    coordinates: [7.9978, 31.9038],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
    confidence: 'High',
    isActive: false
  }
];

// Mock patrol teams
export interface PatrolTeam {
  id: string;
  name: string;
  status: 'Active' | 'Standby' | 'Off-duty';
  location: string;
  members: number;
  lastContact: Date;
}

const mockPatrolTeams: PatrolTeam[] = [
  {
    id: 'PT-001',
    name: 'Team Alpha',
    status: 'Active',
    location: 'Eastern Panyagor',
    members: 4,
    lastContact: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 'PT-002',
    name: 'Team Bravo',
    status: 'Standby',
    location: 'Command Center',
    members: 5,
    lastContact: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: 'PT-003',
    name: 'Team Charlie',
    status: 'Active',
    location: 'Southern Border',
    members: 6,
    lastContact: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    id: 'PT-004',
    name: 'UNMISS Patrol',
    status: 'Active',
    location: 'Duk Border',
    members: 8,
    lastContact: new Date(Date.now() - 1000 * 60 * 45)
  }
];

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate occasional network failures for testing error handling
const simulateNetworkError = () => {
  const shouldFail = Math.random() < 0.05; // 5% chance of failure
  if (shouldFail) {
    throw new ApiError('Network connection error', 503, 'NETWORK_ERROR');
  }
};

// Validate required fields
const validateRequired = (obj: object, fields: string[]) => {
  const missing = fields.filter(field => !obj[field as keyof typeof obj]);
  if (missing.length > 0) {
    throw new ApiError(`Missing required fields: ${missing.join(', ')}`, 400, 'MISSING_FIELDS');
  }
};

// API service with enhanced error handling
export const api = {
  // Alerts
  getAlerts: async (): Promise<AlertItem[]> => {
    try {
      await delay(800);
      simulateNetworkError();
      return [...mockAlerts];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch alerts', 500, 'FETCH_ALERTS_FAILED');
    }
  },
  
  getAlertById: async (id: string): Promise<AlertItem> => {
    try {
      if (!id) throw new ApiError('Alert ID is required', 400, 'MISSING_ID');
      
      await delay(500);
      simulateNetworkError();
      
      const alert = mockAlerts.find(alert => alert.id === id);
      if (!alert) throw new ApiError(`Alert with ID ${id} not found`, 404, 'ALERT_NOT_FOUND');
      
      return alert;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch alert details', 500, 'FETCH_ALERT_FAILED');
    }
  },
  
  createAlert: async (alert: Omit<AlertItem, 'id'>): Promise<AlertItem> => {
    try {
      validateRequired(alert, ['title', 'description', 'location', 'level']);
      
      await delay(1000);
      simulateNetworkError();
      
      const newAlert: AlertItem = {
        ...alert,
        id: `${mockAlerts.length + 1}`.padStart(3, '0')
      };
      mockAlerts.unshift(newAlert);
      return newAlert;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create alert', 500, 'CREATE_ALERT_FAILED');
    }
  },
  
  updateAlert: async (id: string, updates: Partial<AlertItem>): Promise<AlertItem> => {
    try {
      if (!id) throw new ApiError('Alert ID is required', 400, 'MISSING_ID');
      
      await delay(1000);
      simulateNetworkError();
      
      const alertIndex = mockAlerts.findIndex(alert => alert.id === id);
      if (alertIndex === -1) throw new ApiError(`Alert with ID ${id} not found`, 404, 'ALERT_NOT_FOUND');
      
      mockAlerts[alertIndex] = {
        ...mockAlerts[alertIndex],
        ...updates
      };
      return mockAlerts[alertIndex];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update alert', 500, 'UPDATE_ALERT_FAILED');
    }
  },
  
  // Heat signatures
  getHeatSignatures: async (): Promise<HeatSignature[]> => {
    try {
      await delay(1200);
      simulateNetworkError();
      return [...mockHeatSignatures];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch heat signatures', 500, 'FETCH_HEAT_SIGNATURES_FAILED');
    }
  },
  
  // Patrol teams
  getPatrolTeams: async (): Promise<PatrolTeam[]> => {
    try {
      await delay(700);
      simulateNetworkError();
      return [...mockPatrolTeams];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch patrol teams', 500, 'FETCH_TEAMS_FAILED');
    }
  },
  
  updatePatrolTeam: async (id: string, updates: Partial<PatrolTeam>): Promise<PatrolTeam> => {
    try {
      if (!id) throw new ApiError('Team ID is required', 400, 'MISSING_ID');
      
      await delay(800);
      simulateNetworkError();
      
      const teamIndex = mockPatrolTeams.findIndex(team => team.id === id);
      if (teamIndex === -1) throw new ApiError(`Team with ID ${id} not found`, 404, 'TEAM_NOT_FOUND');
      
      mockPatrolTeams[teamIndex] = {
        ...mockPatrolTeams[teamIndex],
        ...updates
      };
      return mockPatrolTeams[teamIndex];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update patrol team', 500, 'UPDATE_TEAM_FAILED');
    }
  },
  
  // Drone verification
  requestDroneVerification: async (alertId: string, team: string): Promise<{success: boolean; estimatedArrival: number}> => {
    try {
      if (!alertId) throw new ApiError('Alert ID is required', 400, 'MISSING_ALERT_ID');
      if (!team) throw new ApiError('Drone team name is required', 400, 'MISSING_TEAM');
      
      // Verify alert exists
      const alert = mockAlerts.find(a => a.id === alertId);
      if (!alert) throw new ApiError(`Alert with ID ${alertId} not found`, 404, 'ALERT_NOT_FOUND');
      
      await delay(1500);
      simulateNetworkError();
      
      return {
        success: true,
        estimatedArrival: Math.floor(Math.random() * 15) + 5 // Random arrival time between 5-20 minutes
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to request drone verification', 500, 'DRONE_REQUEST_FAILED');
    }
  },
  
  submitVerificationResult: async (alertId: string, verified: boolean, notes: string): Promise<{success: boolean}> => {
    try {
      if (!alertId) throw new ApiError('Alert ID is required', 400, 'MISSING_ALERT_ID');
      if (verified === undefined) throw new ApiError('Verification status is required', 400, 'MISSING_VERIFICATION');
      
      await delay(1000);
      simulateNetworkError();
      
      // Update the alert's verification status
      const alertIndex = mockAlerts.findIndex(alert => alert.id === alertId);
      if (alertIndex === -1) throw new ApiError(`Alert with ID ${alertId} not found`, 404, 'ALERT_NOT_FOUND');
      
      mockAlerts[alertIndex].verified = verified;
      
      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to submit verification result', 500, 'VERIFICATION_SUBMIT_FAILED');
    }
  },
  
  // SMS Notifications
  sendSMSAlert: async (
    message: string, 
    level: AlertLevel, 
    regions: string[]
  ): Promise<{success: boolean; recipients: number}> => {
    try {
      if (!message) throw new ApiError('Message is required', 400, 'MISSING_MESSAGE');
      if (!level) throw new ApiError('Alert level is required', 400, 'MISSING_LEVEL');
      if (!regions || regions.length === 0) throw new ApiError('At least one region must be selected', 400, 'MISSING_REGIONS');
      
      await delay(2000);
      simulateNetworkError();
      
      // Simulate sending SMS to multiple regions
      const recipients = regions.reduce((total, region) => {
        switch(region) {
          case 'panyagor': return total + 342;
          case 'poktap': return total + 213;
          case 'duk': return total + 187;
          case 'makuach': return total + 276;
          case 'eastern': return total + 104;
          default: return total;
        }
      }, 0);
      
      return {
        success: true,
        recipients
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to send SMS alerts', 500, 'SMS_SEND_FAILED');
    }
  }
}; 