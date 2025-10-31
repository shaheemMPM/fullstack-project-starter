import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EmailProcessor } from './processors/email.processor';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';

/**
 * Queue Module
 * Manages background job processing with BullMQ
 */
@Module({
	imports: [
		// Register the email queue
		BullModule.forRoot({
			connection: {
				host: process.env.REDIS_HOST || 'localhost',
				port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
			},
		}),
		BullModule.registerQueue({
			name: 'email',
		}),
	],
	controllers: [QueueController],
	providers: [QueueService, EmailProcessor],
	exports: [QueueService],
})
export class QueueModule {}
