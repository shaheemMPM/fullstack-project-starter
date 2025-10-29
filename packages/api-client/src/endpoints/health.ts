import type { ApiClient } from '../client';
import type { HealthResponse } from '../types';

export class HealthEndpoints {
	constructor(private client: ApiClient) {}

	/**
	 * Check API health status
	 */
	async check(): Promise<HealthResponse> {
		return this.client.get<HealthResponse>('/api/health');
	}
}
