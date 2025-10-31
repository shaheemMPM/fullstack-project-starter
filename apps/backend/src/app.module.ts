import { AuthModule } from '@modules/auth/auth.module';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { EmailModule } from '@modules/email/email.module';
import { HealthModule } from '@modules/health/health.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
	imports: [
		// BullMQ configuration (shared by all queue modules)
		BullModule.forRoot({
			connection: {
				host: process.env.REDIS_HOST || 'localhost',
				port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
			},
		}),
		HealthModule,
		AuthModule,
		EmailModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
