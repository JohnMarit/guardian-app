
export enum AlertLevel {
  High = "high",
  Medium = "medium",
  Low = "low",
  Info = "info"
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  level: AlertLevel;
  verified: boolean;
}
