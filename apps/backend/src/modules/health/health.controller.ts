import { Public } from '@modules/auth/decorators/public.decorator';
import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import type { HealthResponse } from './health.types';

@Controller('health')
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@Public()
	@Get()
	check(): HealthResponse {
		return this.healthService.check();
	}
}
