import { AuthModule } from '@modules/auth/auth.module';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { HealthModule } from '@modules/health/health.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { QueueModule } from './queue/queue.module';

@Module({
	imports: [HealthModule, AuthModule, QueueModule],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
