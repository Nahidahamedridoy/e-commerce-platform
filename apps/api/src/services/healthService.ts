export interface HealthStatus {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptime: number;
  environment: string;
  service: string;
  version: string;
}

export const getHealthStatus = (): HealthStatus => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    service: 'amar-dokan-api',
    version: '1.0.0',
  };
};
