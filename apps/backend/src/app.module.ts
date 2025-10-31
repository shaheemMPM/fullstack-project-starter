import { AuthModule } from '@modules/auth/auth.module';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { EmailModule } from '@modules/email/email.module';
import { HealthModule } from '@modules/health/health.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@shared/services/config.service';
import { SharedModule } from '@shared/shared.module';

@Module({
	imports: [
		// Shared services (global)
		SharedModule,
		// BullMQ configuration (shared by all queue modules)
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				connection: configService.redisConfig,
			}),
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
