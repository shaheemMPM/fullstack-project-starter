import { AuthModule } from '@modules/auth/auth.module';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { HealthModule } from '@modules/health/health.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
	imports: [HealthModule, AuthModule],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
