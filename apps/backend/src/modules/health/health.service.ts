import { Injectable } from '@nestjs/common';
import * as os from 'os';

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
  uptime: number;
  environment: string;
  platform: string;
  nodeVersion: string;
}

@Injectable()
export class HealthService {
  private readonly startTime: number = Date.now();

  check(): HealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      environment: process.env.NODE_ENV || 'development',
      platform: `${os.type()} ${os.release()}`,
      nodeVersion: process.version,
    };
  }
}
