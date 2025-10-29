/**
 * Plain TypeScript interfaces for health module
 * No dependencies - safe to import from frontend/api-client
 */

export interface HealthResponse {
	status: 'ok';
	timestamp: string;
	uptime: number;
	environment: string;
	platform: string;
	nodeVersion: string;
}
