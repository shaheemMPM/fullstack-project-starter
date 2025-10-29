import { Controller, Get } from '@nestjs/common';
import { type HealthResponse, HealthService } from './health.service';

@Controller('health')
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@Get()
	check(): HealthResponse {
		return this.healthService.check();
	}
}
